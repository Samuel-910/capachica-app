import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServiciosService } from '../../core/services/servicios.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SidebarComponent, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServicioComponent implements OnInit {
  isLoading: boolean = false;
  servicios: any[] = [];
  serviciosFiltrados: any[] = [];
  formServicio: FormGroup;
  emprendimientoId = 1; // Cambiar dinámicamente si es necesario
  editando = false;
  servicioEditandoId: number | null = null;
  paginaActual = 1;
  limitePorPagina = 10;
  totalElementos = 0;
  searchTerm = '';

  constructor(
    private servicioService: ServiciosService,
    private fb: FormBuilder
  ) {
    this.formServicio = this.fb.group({
      tipoServicioId: [null, Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioBase: [null, [Validators.required, Validators.min(0)]],
      moneda: ['PEN', Validators.required],
      estado: ['activo', Validators.required],
      detallesServicio: this.fb.group({
        idiomas: [''],
        experiencia: [''],
        incluye: ['']
      }),
      emprendimientoId: [this.emprendimientoId, Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerServicios();
  }

  obtenerServicios(): void {
    this.isLoading = true; // Indicamos que estamos cargando los datos
    this.servicioService.listarServicios().subscribe(
      (res: any) => {
        this.servicios = Array.isArray(res) ? res : res.data || []; // Asignamos los servicios obtenidos
        this.isLoading = false; // Terminamos de cargar los datos
      },
      (err) => {
        console.error('Error en la solicitud', err);
        this.isLoading = false;
      }
    );
  }

  crearServicio(): void {
    if (this.formServicio.invalid) {
      this.formServicio.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    const request$ = this.editando && this.servicioEditandoId !== null
      ? this.servicioService.actualizarServicio(this.servicioEditandoId, payload)
      : this.servicioService.crearServicio(payload);

    request$.subscribe(() => {
      this.resetFormAndRefresh();
    }, err => console.error('Error al guardar servicio', err));
  }

  private buildPayload(): any {
    const fv = this.formServicio.value;
    return {
      tipoServicioId: Number(fv.tipoServicioId),
      nombre: fv.nombre,
      descripcion: fv.descripcion,
      precioBase: Number(fv.precioBase),
      moneda: fv.moneda,
      estado: fv.estado,
      detallesServicio: {
        idiomas: fv.detallesServicio.idiomas,
        experiencia: fv.detallesServicio.experiencia,
        incluye: fv.detallesServicio.incluye
      },
      emprendimientoId: Number(fv.emprendimientoId)
    };
  }

  private resetFormAndRefresh(): void {
    this.editando = false;
    this.servicioEditandoId = null;
    this.obtenerServicios();
    this.formServicio.reset({
      tipoServicioId: null,
      nombre: '',
      descripcion: '',
      precioBase: null,
      moneda: 'PEN',
      estado: 'activo',
      detallesServicio: { idiomas: '', experiencia: '', incluye: '' },
      emprendimientoId: this.emprendimientoId
    });
  }

  editarServicio(servicio: any): void {
    this.editando = true;
    this.servicioEditandoId = servicio.id;
    // Patch values matching form controls
    this.formServicio.patchValue({
      tipoServicioId: servicio.tipoServicioId,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precioBase: servicio.precioBase,
      moneda: servicio.moneda,
      estado: servicio.estado,
      detallesServicio: {
        idiomas: servicio.detallesServicio?.idiomas || '',
        experiencia: servicio.detallesServicio?.experiencia || '',
        incluye: servicio.detallesServicio?.incluye || ''
      },
      emprendimientoId: servicio.emprendimientoId
    });
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id)
        .subscribe(() => this.obtenerServicios());
    }
  }
  cambiarEstado(id: number, estado: string): void {
    this.servicioService.actualizarEstadoServicio(id, { estado })  // Pasar el estado a través del cuerpo de la solicitud
      .subscribe(
        (res) => {
          console.log('Estado actualizado exitosamente:', res);
          this.obtenerServicios();  // Recargar la lista de servicios luego de actualizar el estado
        },
        (error) => {
          console.error('Error al actualizar el estado:', error);
        }
      );
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalElementos / this.limitePorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerServicios();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.obtenerServicios();
    }
  }
}

