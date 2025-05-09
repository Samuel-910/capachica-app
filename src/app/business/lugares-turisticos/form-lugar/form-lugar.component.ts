import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LugaresService } from '../../../core/services/lugar.service';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-lugar',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './form-lugar.component.html',
  styleUrls: ['./form-lugar.component.css']
})
export class FormLugarComponent implements OnInit {
   selectedFile: File | null = null;
  previewUrl: string | null = null;
  lugarForm!: FormGroup;
  isEdit: boolean = false;
  lugarIdEdit: string | null = null;

  constructor(
    private fb: FormBuilder,
    private lugaresService: LugaresService,
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.lugarForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      direccion: ['', Validators.required],
      coordenadas: ['', Validators.required],
      horarioApertura: [''],
      horarioCierre: [''],
      costoEntrada: [null],
      recomendaciones: [''],
      restricciones: [''],
      esDestacado: [false],
      estado: ['activo', Validators.required],
      imagenes: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.lugarIdEdit = id;
      this.cargarLugar(id);
    }
  }

  cargarLugar(id: string): void {
    this.lugaresService.getLugar(id).subscribe({
      next: (lugar) => {
        this.lugarForm.patchValue({
          nombre: lugar.nombre,
          descripcion: lugar.descripcion,
          direccion: lugar.direccion,
          coordenadas: lugar.coordenadas,
          horarioApertura: lugar.horarioApertura,
          horarioCierre: lugar.horarioCierre,
          costoEntrada: lugar.costoEntrada,
          recomendaciones: lugar.recomendaciones,
          restricciones: lugar.restricciones,
          esDestacado: lugar.esDestacado,
          estado: lugar.estado
        });
        this.previewUrl = lugar.imagenes.length ? lugar.imagenes[0].url : null;
      },
      error: (err) => {
        console.error('Error al cargar lugar:', err);
        Swal.fire('Error', 'No se pudo cargar el lugar.', 'error');
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async subirImagenASupabase(file: File): Promise<string> {
    Swal.fire({
      title: 'Subiendo imagen...',
      text: 'Por favor espere mientras se sube la imagen.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const supabase = this.supabaseService.getClient();
    const filePath = `lugares-turisticos/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage.from('lugares-turisticos').upload(filePath, file);
    if (error) {
      Swal.close();
      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage.from('lugares-turisticos').getPublicUrl(filePath);
    Swal.close();
    return publicUrlData?.publicUrl;
  }

async guardarLugar() {
  if (this.lugarForm.invalid) {
    const camposInvalidos = Object.keys(this.lugarForm.controls)
      .filter(key => this.lugarForm.get(key)?.invalid)
      .map(key => {
        switch (key) {
          case 'nombre': return 'Nombre';
          case 'descripcion': return 'Descripción';
          case 'direccion': return 'Dirección';
          case 'coordenadas': return 'Coordenadas';
          case 'estado': return 'Estado';
          default: return key;
        }
      });

    Swal.fire({
      icon: 'error',
      title: 'Formulario incompleto',
      html: `Por favor corrige o completa los siguientes campos:<br><b>${camposInvalidos.join(', ')}</b>`
    });
    return;
  }

  const formValue = this.lugarForm.getRawValue();
  let imagenes: { url: string }[] = [];  // Ahora solo será un arreglo con la propiedad 'url'

  // Subir la imagen solo si hay un archivo seleccionado
  if (this.selectedFile) {
    try {
      // Aquí se sube la imagen a Supabase y obtenemos la URL
      const imagenUrl = await this.subirImagenASupabase(this.selectedFile);
      // Solo agregamos el objeto con 'url'
      imagenes.push({ url: imagenUrl });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      Swal.fire('Error', 'No se pudo subir la imagen del lugar.', 'error');
      return;
    }
  }

  const payload = {
    nombre: formValue.nombre,
    descripcion: formValue.descripcion,
    direccion: formValue.direccion,
    coordenadas: formValue.coordenadas,
    horarioApertura: formValue.horarioApertura || null,
    horarioCierre: formValue.horarioCierre || null,
    costoEntrada: formValue.costoEntrada || null,
    recomendaciones: formValue.recomendaciones || null,
    restricciones: formValue.restricciones || null,
    esDestacado: formValue.esDestacado,
    estado: formValue.estado,
    imagenes: imagenes.length > 0 ? imagenes : []  // Ahora solo mandamos la URL
  };

  if (this.isEdit && this.lugarIdEdit) {
    this.lugaresService.updateLugar(this.lugarIdEdit, payload).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El lugar fue actualizado correctamente.', 'success');
        this.lugarForm.reset();
        this.router.navigate(['/lugares-turisticos']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire('Error', 'No se pudo actualizar el lugar.', 'error');
      }
    });
  } else {
    this.lugaresService.crearLugar(payload).subscribe({
      next: () => {
        Swal.fire('Registrado', 'El lugar fue registrado correctamente.', 'success');
        this.lugarForm.reset();
        this.router.navigate(['/lugares-turisticos']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        Swal.fire('Error', 'No se pudo registrar el lugar.', 'error');
      }
    });
  }
}




  cancelar() {
    this.router.navigate(['/lugares-turisticos']);
  }
}
