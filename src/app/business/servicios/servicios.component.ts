import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiciosService } from '../../core/services/servicios.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServicioComponent implements OnInit {
  servicios: any[] = [];
  formServicio: FormGroup;
  emprendimientoId = 1; // puedes cambiar esto dinámicamente
  editando = false;
  servicioEditandoId: number | null = null;
  cargando = false;

  // Variables de paginación
  paginaActual = 1;
  limitePorPagina = 10;
  totalElementos = 0;
  
  

  constructor(private servicioService: ServiciosService, private fb: FormBuilder) {
    this.formServicio = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]]
    });
    
  }

  ngOnInit(): void {
    this.obtenerServicios();
  }
  

  obtenerServicios(): void {
    this.servicioService.getAllServicios(this.paginaActual, this.limitePorPagina).subscribe(
      (res: any) => {
        console.log('Respuesta de la API:', res); // Verifica la estructura
        if (res) {
          this.servicios = res; // Si directamente es un array
          this.totalElementos = res.length; // Ajusta si la respuesta es un array simple
          // No necesitas asignar 'totalPaginas' aquí, porque se calcula dinámicamente con el getter
        } else {
          console.error('Error al obtener datos', res);
        }
      },
      error => {
        console.error('Error en la solicitud', error);
      }
    );
  }
  
  
  
  crearServicio(): void {
    if (this.editando && this.servicioEditandoId !== null) {
      this.servicioService.actualizarServicio(this.servicioEditandoId, this.formServicio.value).subscribe(() => {
        this.obtenerServicios();
        this.formServicio.reset();
        this.editando = false;
        this.servicioEditandoId = null;
      });
    } else {
      this.servicioService.crearServicio(this.emprendimientoId, this.formServicio.value).subscribe(() => {
        this.obtenerServicios();
        this.formServicio.reset();
      });
    }
  }

  editarServicio(servicio: any): void {
    this.editando = true;
    this.servicioEditandoId = servicio.id;
    this.formServicio.patchValue(servicio);
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id).subscribe(() => {
        this.obtenerServicios();
      });
    }
  }

  cambiarEstado(id: number): void {
    this.servicioService.cambiarEstado(id).subscribe(() => {
      this.obtenerServicios();
    });
  }

  // Métodos de paginación
  get totalPaginas(): number {
    return Math.ceil(this.totalElementos / this.limitePorPagina);
  }

  getLimiteSuperior(): number {
    const limite = this.paginaActual * this.limitePorPagina;
    return limite > this.totalElementos ? this.totalElementos : limite;
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
