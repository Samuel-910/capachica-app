import { Component, DoCheck, OnInit } from '@angular/core';
import { ServiciosService } from '../../core/services/servicios.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../sidebar/navbar/navbar.component';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterModule, NavbarComponent,FormsModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServicioComponent implements OnInit , DoCheck{
  filtroBusqueda: string = '';
  columnaBusqueda: string = 'nombre'; // Predeterminado a 'nombre'
  isLoading = true;
  servicios: any[] = [];
  serviciosFiltrados: any[] = [];

  constructor(
    private router: Router,
    private serviciosService: ServiciosService
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.serviciosService.listarServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.isLoading = false;
        this.serviciosFiltrados = [...this.servicios];
        console.log('Servicios cargados:', data);
      },
      error: (err) => {
        console.error('Error al obtener servicios:', err);
      }
    });
  }

  ngDoCheck(): void {
    const texto = this.filtroBusqueda.toLowerCase();

    this.serviciosFiltrados = this.servicios.filter((s) => {
      if (!texto) return true;

      switch (this.columnaBusqueda) {
        case 'nombre':
          return s.nombre?.toLowerCase().includes(texto);
        case 'descripcion':
          return s.descripcion?.toLowerCase().includes(texto);
        case 'precioBase':
          return s.precioBase?.toLowerCase().includes(texto);
        case 'estado':
          return s.estado?.toLowerCase().includes(texto);
        case 'tipoServicio.nombre':
          return s.tipoServicio?.nombre?.toLowerCase().includes(texto);
        default:
          return false;
      }
    });
  }

  editar(id: string): void {
    this.router.navigate([`/editservicio/${id}`]);
  }

  eliminar(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviciosService.eliminarServicio(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'El servicio ha sido eliminado correctamente.'
            });
            this.cargarServicios();
          },
          error: (error) => {
            console.error('Error al eliminar servicio:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el servicio.'
            });
          }
        });
      }
    });
  }
}

