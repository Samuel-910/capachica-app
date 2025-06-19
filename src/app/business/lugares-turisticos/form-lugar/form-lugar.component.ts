import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LugaresService } from '../../../core/services/lugar.service';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';
import Swal from 'sweetalert2';
declare let L: any;
@Component({
  selector: 'app-form-lugar',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './form-lugar.component.html',
  styleUrls: ['./form-lugar.component.css']
})
export class FormLugarComponent implements OnInit {
  @ViewChild('mapContainer', { static: false })
  mapContainer!: ElementRef<HTMLDivElement>;

  previewUrls: string[] = [];
  map!: any;
  marker!: any;
  selectedFile: File[] = [];
  previewUrl: string[] = [];
  lugarForm!: FormGroup;
  isEdit = false;
  lugarIdEdit: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly lugaresService: LugaresService,
    private readonly supabaseService: SupabaseService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.lugarForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      direccion: ['', Validators.required],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required],
      horarioApertura: [''],
      horarioCierre: [''],
      costoEntrada: [0, Validators.required],
      recomendaciones: [''],
      restricciones: [''],
      esDestacado: [false],
      imagenes: this.fb.array([]),
      estado: ['activo', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.lugarIdEdit = id;
      this.cargarLugar(id);
    }
  }
  /** Eliminar una imagen de la selección */
  removeImage(index: number): void {
    this.selectedFile.splice(index, 1);
    this.previewUrl.splice(index, 1);
  }
  ngAfterViewInit(): void {
    const center = { lat: -15.6000, lng: -69.9000 };
    this.map = L.map(this.mapContainer.nativeElement)
      .setView([center.lat, center.lng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      if (this.marker) this.map.removeLayer(this.marker);
      this.marker = L.marker([lat, lng]).addTo(this.map);
      this.lugarForm.patchValue({ latitud: lat, longitud: lng });
    });

    // si ya editando, colocar marcador
    setTimeout(() => {
      const lat = this.lugarForm.get('latitud')!.value;
      const lng = this.lugarForm.get('longitud')!.value;
      if (lat != null && lng != null) {
        this.marker = L.marker([lat, lng]).addTo(this.map);
        this.map.setView([lat, lng], 13);
      }
    }, 500);
  }
  private cargarLugar(id: string): void {
    this.lugaresService.getLugar(id).subscribe({
      next: lugar => {
        console.log(lugar)
        this.lugarForm.patchValue({
          nombre: lugar.nombre,
          descripcion: lugar.descripcion,
          direccion: lugar.direccion,
          latitud: lugar.latitud,
          longitud: lugar.longitud,
          horarioApertura: lugar.horarioApertura
            ? lugar.horarioApertura.substring(0, 10)
            : null,
          horarioCierre: lugar.horarioCierre
            ? lugar.horarioCierre.substring(0, 10)
            : null,
          costoEntrada: lugar.costoEntrada,
          recomendaciones: lugar.recomendaciones,
          restricciones: lugar.restricciones,
          esDestacado: lugar.esDestacado,
          estado: lugar.estado
        });
        // Agregar las URLs de las imágenes al formulario
        if (lugar.imagenes && lugar.imagenes.length > 0) {
          const imagenesControl = this.lugarForm.get('imagenes') as any;
          lugar.imagenes.forEach((img: any) => {
            imagenesControl.push(this.fb.control(img.url));  // Agregar cada URL de imagen al formulario
          });
        }
      },
      error: err => {
        console.error('Error al cargar lugar:', err);
        Swal.fire('Error', 'No se pudo cargar el lugar.', 'error');
      }
    });
  }

  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    if (!files.length) return;
    Array.from(files).forEach(file => {
      this.selectedFile.push(file);
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.push(reader.result as string);
      reader.readAsDataURL(file);
    });
    // Reset para permitir re-selección del mismo archivo
    event.target.value = '';
  }
  async subirImagenASupabase(file: File): Promise<string> {
    Swal.fire({
      title: 'Subiendo imagen...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });
    const supabase = this.supabaseService.getClient();
    const path = `lugares-turisticos/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('lugares-turisticos').upload(path, file);
    if (error) {
      Swal.close();
      throw new Error(error.message);
    }
    const { data } = supabase.storage.from('lugares-turisticos').getPublicUrl(path);
    Swal.close();
    return data.publicUrl;
  }

  async guardarLugar(): Promise<void> {
    if (this.lugarForm.invalid) {
      const invalidos = Object.keys(this.lugarForm.controls)
        .filter(k => this.lugarForm.get(k)?.invalid);
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        html: `Por favor completa: <b>${invalidos.join(', ')}</b>`
      });
      return;
    }

    Swal.fire({
      title: 'Guardando lugar...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });

    // Subir imágenes
    const imagenUrls: string[] = [];
    for (const file of this.selectedFile) {
      try {
        imagenUrls.push(await this.subirImagenASupabase(file));
      } catch (err) {
        Swal.close();
        await Swal.fire('Error', 'No se pudieron subir todas las imágenes.', 'error');
        return;
      }
    }

    const fv = this.lugarForm.getRawValue();
    const payload = {
      nombre: fv.nombre,
      descripcion: fv.descripcion,
      direccion: fv.direccion,
      latitud: fv.latitud,
      longitud: fv.longitud,
      horarioApertura: fv.horarioApertura || null,
      horarioCierre: fv.horarioCierre || null,
      costoEntrada: fv.costoEntrada || null,
      recomendaciones: fv.recomendaciones || null,
      restricciones: fv.restricciones || null,
      esDestacado: fv.esDestacado,
      estado: fv.estado,
      imagenes: imagenUrls.map(u => ({ url: u }))
    };

    const req$ = this.isEdit && this.lugarIdEdit
      ? this.lugaresService.updateLugar(this.lugarIdEdit, payload)
      : this.lugaresService.crearLugar(payload);

    req$.subscribe({
      next: () => {
        Swal.close();
        Swal.fire(
          this.isEdit ? 'Actualizado' : 'Registrado',
          'El lugar fue guardado correctamente.',
          'success'
        );
        this.lugarForm.reset();
        this.router.navigate(['/lugares-turisticos']);
      },
      error: err => {
        Swal.close();
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar el lugar.', 'error');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/lugares-turisticos']);
  }
}