import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TiposServicioService } from '../../core/services/tipos-servicio.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-tipos-servicio',
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule, SidebarComponent],
  standalone: true,
  templateUrl: './tipos-servicio.component.html',
  styleUrls: ['./tipos-servicio.component.css'],
})
export class TiposServicioComponent implements OnInit {
  // Propiedades para el estado de la carga, errores y creación
  isLoading: boolean = false;
  isCreating: boolean = false;
  errorMessage: string = '';
  tiposServicio: any[] = [];
  tipoServicioForm: FormGroup;

  constructor(
    private tiposServicioService: TiposServicioService,
    private fb: FormBuilder
  ) {
    this.tipoServicioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      requiereCupo: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerTiposServicio();
  }

  // Obtener todos los tipos de servicio
  obtenerTiposServicio(): void {
    this.isLoading = true;  // Activamos el estado de carga
    this.tiposServicioService.obtenerTiposServicio().subscribe(
      (data) => {
        this.tiposServicio = data;
        this.isLoading = false;  // Desactivamos el estado de carga
      },
      (error) => {
        console.error('Error al obtener los tipos de servicio', error);
        this.isLoading = false;  // Desactivamos el estado de carga
        this.errorMessage = 'Hubo un problema al cargar los tipos de servicio.';  // Mensaje de error
      }
    );
  }

  // Crear un nuevo tipo de servicio
  crearTipoServicio(): void {
    if (this.tipoServicioForm.invalid) return;

    this.isCreating = true;  // Activamos el estado de creación
    this.tiposServicioService.crearTipoServicio(this.tipoServicioForm.value).subscribe(
      (response) => {
        console.log('Tipo de servicio creado', response);
        this.obtenerTiposServicio();  // Recargar la lista de tipos de servicio
        this.tipoServicioForm.reset();  // Limpiar el formulario
        this.isCreating = false;  // Desactivamos el estado de creación
      },
      (error) => {
        console.error('Error al crear tipo de servicio', error);
        this.isCreating = false;  // Desactivamos el estado de creación
        this.errorMessage = 'Hubo un problema al crear el tipo de servicio.';  // Mensaje de error
      }
    );
  }

  // Eliminar un tipo de servicio
  eliminarTipoServicio(id: number): void {
    this.tiposServicioService.eliminarTipoServicio(id).subscribe(
      () => {
        console.log('Tipo de servicio eliminado');
        this.obtenerTiposServicio();  // Recargar la lista de tipos de servicio
      },
      (error) => {
        console.error('Error al eliminar tipo de servicio', error);
        this.errorMessage = 'Hubo un problema al eliminar el tipo de servicio.';  // Mensaje de error
      }
    );
  }
}
