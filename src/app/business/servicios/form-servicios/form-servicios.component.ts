import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServiciosService } from '../../../core/services/servicios.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../../core/services/supabase.service';
import { TiposServicioService } from '../../../core/services/tipos-servicios.service';

@Component({
  selector: 'app-form-servicios',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './form-servicios.component.html',
  styleUrls: ['./form-servicios.component.css']
})
export class FormServiciosComponent implements OnInit {
 selectedFiles: File[] = [];
  previewUrls: string[] = [];
  servicioForm!: FormGroup;
  tiposServicio: any[] = [];
  isEdit = false;
  servicioIdEdit: number | null = null;

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService,
    private tiposServicioService: TiposServicioService,
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializar el form con sub‐group dinámico para detallesServicio
    this.servicioForm = this.fb.group({
      nombre:         ['', Validators.required],
      descripcion:    ['', Validators.required],
      precioBase:     [0,  Validators.required],
      moneda:         ['', Validators.required],
      estado:         ['activo', Validators.required],
      tipoServicioId: [0,  Validators.required],
      detallesServicio: this.fb.group({})    // formGroup dinámico
    });

    // Cargar tipos de servicio
    this.tiposServicioService.listarTiposServicio().subscribe({
      next: data => this.tiposServicio = data,
      error: err => {
        console.error('Error al cargar tipos de servicio:', err);
        Swal.fire('Error', 'No se pudieron cargar los tipos de servicio.', 'error');
      }
    });

    // Si hay ID en ruta, cargar para edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.servicioIdEdit = +id;
      this.serviciosService.obtenerServicio(this.servicioIdEdit).subscribe({
        next: servicio => {
          // Patch de los campos básicos
          this.servicioForm.patchValue({
            nombre:         servicio.nombre,
            descripcion:    servicio.descripcion,
            precioBase:     servicio.precioBase,
            moneda:         servicio.moneda,
            estado:         servicio.estado,
            tipoServicioId: servicio.tipoServicio?.id
          });
          // Crear controles dinámicos para cada clave en detallesServicio
          const detalles = servicio.detallesServicio || {};
          const grp = this.detallesServicioGroup;
          Object.entries(detalles).forEach(([key, val]) => {
            grp.addControl(key, this.fb.control(val));
          });
        },
        error: err => {
          console.error('Error al cargar servicio:', err);
          Swal.fire('Error', 'No se pudo cargar el servicio.', 'error');
        }
      });
    }
  }

  /** Getter seguro para el FormGroup dinámico */
  get detallesServicioGroup(): FormGroup {
    return this.servicioForm.get('detallesServicio') as FormGroup;
  }

  /** Lista de claves para iterar en la plantilla */
  get detalleKeys(): string[] {
    return Object.keys(this.detallesServicioGroup.controls);
  }

  /** Añadir un nuevo campo dinámico */
  async addDetalle(): Promise<void> {
    const { value: key } = await Swal.fire<string>({
      title: 'Nuevo detalle',
      input: 'text',
      inputLabel: 'Nombre del campo',
      inputPlaceholder: 'ej. incluye, requisitos, idiomas...',
      showCancelButton: true,
      inputValidator: v => !v ? 'Debes escribir algo' : null
    });
    if (!key) return;

    const grp = this.detallesServicioGroup;
    if (grp.contains(key)) {
      await Swal.fire('Error', 'Ya existe un campo con ese nombre.', 'error');
      return;
    }
    grp.addControl(key, this.fb.control(''));
  }

  /** Eliminar una imagen de la selección */
  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  /** Manejar selección múltiple de archivos y generar previews */
  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    if (!files.length) return;
    Array.from(files).forEach(file => {
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = () => this.previewUrls.push(reader.result as string);
      reader.readAsDataURL(file);
    });
    // Reset para permitir re-selección del mismo archivo
    event.target.value = '';
  }

  /** Subir un archivo a Supabase y devolver la URL pública */
  async subirImagenASupabase(file: File): Promise<string> {
    Swal.fire({
      title: 'Subiendo imagen...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });
    const supabase = this.supabaseService.getClient();
    const path = `servicios/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('servicios').upload(path, file);
    if (error) {
      Swal.close();
      throw new Error(error.message);
    }
    const { data } = supabase.storage.from('servicios').getPublicUrl(path);
    Swal.close();
    return data.publicUrl;
  }

  /** Guardar servicio: validaciones, subida de imágenes, transformación de detalles */
  async guardarServicio(): Promise<void> {
    // Validar formulario
    if (this.servicioForm.invalid) {
      const invalidos = Object.keys(this.servicioForm.controls)
        .filter(k => this.servicioForm.get(k)?.invalid);
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        html: `Por favor completa: <b>${invalidos.join(', ')}</b>`
      });
      return;
    }

    const fv = this.servicioForm.getRawValue();
    const precio = Number(fv.precioBase);
    const tipoId = Number(fv.tipoServicioId);

    if (isNaN(precio) || precio <= 0) {
      await Swal.fire('Error', 'El precio debe ser un número mayor que cero.', 'error');
      return;
    }
    if (isNaN(tipoId) || tipoId <= 0) {
      await Swal.fire('Error', 'Selecciona un tipo de servicio válido.', 'error');
      return;
    }

    Swal.fire({
      title: 'Guardando servicio...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });

    // Subir imágenes
    const imagenUrls: string[] = [];
    for (const file of this.selectedFiles) {
      try {
        imagenUrls.push(await this.subirImagenASupabase(file));
      } catch (err) {
        Swal.close();
        await Swal.fire('Error', 'No se pudieron subir todas las imágenes.', 'error');
        return;
      }
    }

    // Procesar todos los campos dinámicos: si es string con comas, lo partimos en array
    const detallesRaw = this.detallesServicioGroup.value as Record<string, any>;
    const detallesProcesados: Record<string, any> = {};
    Object.entries(detallesRaw).forEach(([key, val]) => {
      if (typeof val === 'string' && val.includes(',')) {
        detallesProcesados[key] = val
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      } else {
        detallesProcesados[key] = val;
      }
    });

    // Armar payload
    const payload: any = {
      nombre:           fv.nombre,
      descripcion:      fv.descripcion,
      precioBase:       precio,
      moneda:           fv.moneda,
      estado:           fv.estado,
      tipoServicioId:   tipoId,
      detallesServicio: detallesProcesados,
      imagenes:         imagenUrls.map(u => ({ url: u }))
    };

    // Enviar al backend
    const request$ = this.isEdit && this.servicioIdEdit
      ? this.serviciosService.actualizarServicio(this.servicioIdEdit, payload)
      : this.serviciosService.crearServicio(payload);

    request$.subscribe({
      next: () => {
        Swal.close();
        Swal.fire(
          this.isEdit ? 'Actualizado' : 'Registrado',
          'El servicio se guardó correctamente.',
          'success'
        );
        this.router.navigate(['/servicios']);
      },
      error: err => {
        Swal.close();
        Swal.fire('Error', 'No se pudo guardar el servicio.', 'error');
        console.error(err);
      }
    });
  }
  /** Elimina un campo dinámico de detallesServicio */
removeDetalle(key: string): void {
  const grp = this.detallesServicioGroup;
  if (grp.contains(key)) {
    grp.removeControl(key);
  }
}


  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}
