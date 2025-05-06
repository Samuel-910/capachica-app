import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TiposServicioService } from '../../../core/services/tipos-servicio.service';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-form-tipos-servicio',
  imports: [SidebarComponent, ReactiveFormsModule,RouterModule, CommonModule,HttpClientModule],
  standalone: true,
  templateUrl: './form-tipos-servicio.component.html',
  styleUrls: ['./form-tipos-servicio.component.css']
})
export class FormTiposServicioComponent implements OnInit {
  tipoServicioForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  tipoServicioId: number | null = null; // Para editar un tipo de servicio existente

  constructor(
    private fb: FormBuilder,
    private tiposServicioService: TiposServicioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.tipoServicioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      requiereCupo: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tipoServicioId = +id;
        this.obtenerTipoServicio(id); // Si es un tipo de servicio existente, cargarlo
      }
    });
  }

  // Obtener un tipo de servicio por ID (para editar)
  obtenerTipoServicio(id: string): void {
    this.isLoading = true;
    this.tiposServicioService.obtenerTipoServicio(id).subscribe(
      (data) => {
        this.tipoServicioForm.setValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          requiereCupo: data.requiereCupo,
        });
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error al obtener el tipo de servicio';
        this.isLoading = false;
      }
    );
  }

  // Crear o editar un tipo de servicio
  guardarTipoServicio(): void {
    if (this.tipoServicioForm.invalid) return;

    this.isLoading = true;
    if (this.tipoServicioId) {
      // Editar un tipo de servicio existente
      this.tiposServicioService.editarTipoServicio(this.tipoServicioId, this.tipoServicioForm.value).subscribe(
        (response) => {
          console.log('Tipo de servicio actualizado', response);
          this.router.navigate(['/tipos-servicio']); // Redirigir al listado de tipos de servicio
        },
        (error) => {
          this.errorMessage = 'Error al actualizar el tipo de servicio';
          this.isLoading = false;
        }
      );
    } else {
      // Crear un nuevo tipo de servicio
      this.tiposServicioService.crearTipoServicio(this.tipoServicioForm.value).subscribe(
        (response) => {
          console.log('Tipo de servicio creado', response);
          this.router.navigate(['/tipos-servicio']); // Redirigir al listado de tipos de servicio
        },
        (error) => {
          this.errorMessage = 'Error al crear el tipo de servicio';
          this.isLoading = false;
        }
      );
    }
  }

  // Eliminar un tipo de servicio
  eliminarTipoServicio(id: number): void {
    this.isLoading = true;
    this.tiposServicioService.eliminarTipoServicio(id).subscribe(
      () => {
        console.log('Tipo de servicio eliminado');
        this.router.navigate(['/tipos-servicio']); // Redirigir al listado de tipos de servicio
      },
      (error) => {
        this.errorMessage = 'Error al eliminar el tipo de servicio';
        this.isLoading = false;
      }
    );
  }
}
