import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServiciosService } from '../../../core/services/servicios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-servicios',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './form-servicios.component.html',
  styleUrls: ['./form-servicios.component.css']
})
export class FormServiciosComponent implements OnInit {
  servicioForm: FormGroup;
  isEdit = false;
  currentServicio: any = null;
  tiposServicios: any[] = [];
  emprendimientos: any[] = [];
  emprendimientoId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private serviciosService: ServiciosService
  ) {
    this.servicioForm = this.fb.group({
      tipoServicioId: [null, Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioBase: [null, [Validators.required, Validators.min(0)]],
      moneda: ['PEN', Validators.required],
      estado: ['activo', Validators.required],
      detallesServicio: this.fb.group({
        duracion: ['', Validators.required],
        incluye: ['', Validators.required]
      }),
      emprendimientoId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTiposServicios();
    this.loadEmprendimientos();
    this.checkRouteForEdit();
  }

  private loadTiposServicios(): void {
    this.serviciosService.listarServiciosPorTipo('3').subscribe({
      next: tipos => this.tiposServicios = tipos,
      error: err => console.error('Error al cargar tipos de servicio', err)
    });
  }

  private loadEmprendimientos(): void {
    this.serviciosService.listarServicios().subscribe({
      next: emps => this.emprendimientos = emps,
      error: err => console.error('Error cargando emprendimientos', err)
    });
  }

  private checkRouteForEdit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.serviciosService.obtenerServicio(+id).subscribe({
        next: svc => {
          this.currentServicio = svc;
          this.servicioForm.patchValue({
            tipoServicioId: svc.tipoServicioId,
            nombre: svc.nombre,
            descripcion: svc.descripcion,
            precioBase: svc.precioBase,
            moneda: svc.moneda,
            estado: svc.estado,
            detallesServicio: {
              duracion: svc.detallesServicio?.duracion || '',
              incluye: svc.detallesServicio?.incluye || ''
            },
            emprendimientoId: svc.emprendimientoId
          });
        },
        error: err => console.error('Error al cargar servicio', err)
      });
    }
  }

  guardarServicio(): void {
    if (this.servicioForm.invalid) {
      this.servicioForm.markAllAsTouched();
      return;
    }

    const fv = this.servicioForm.value;
    const payload = {
      tipoServicioId: Number(fv.tipoServicioId),
      nombre: fv.nombre,
      descripcion: fv.descripcion,
      precioBase: Number(fv.precioBase),
      moneda: fv.moneda,
      estado: fv.estado,
      detallesServicio: {
        duracion: fv.detallesServicio.duracion,
        incluye: fv.detallesServicio.incluye
      },
      emprendimientoId: Number(fv.emprendimientoId)
    };

    const request$ = this.isEdit && this.currentServicio
      ? this.serviciosService.actualizarServicio(this.currentServicio.id, payload)
      : this.serviciosService.crearServicio(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/servicios']),
      error: err => console.error('Error al guardar servicio', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}
