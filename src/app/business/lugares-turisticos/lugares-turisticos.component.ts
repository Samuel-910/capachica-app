import { Component, OnInit } from '@angular/core';
import { LugaresService, LugarTuristico } from '../../core/services/lugar.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../sidebar/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lugares-turisticos',
  imports: [SidebarComponent, NavbarComponent, CommonModule, RouterModule,FormsModule],
  standalone: true,
  templateUrl: './lugares-turisticos.component.html',
  styleUrls: ['./lugares-turisticos.component.css']
})
export class LugaresTuristicosComponent implements OnInit {
  filtroBusqueda: string = '';
  columnaBusqueda: string = 'nombre'; // Establecer columna por defecto para búsqueda
  isLoading = true;
  lugares: LugarTuristico[] = [];
  lugaresFiltrados: LugarTuristico[] = [];

  constructor(private router: Router, private lugaresService: LugaresService) {}

  ngOnInit(): void {
    this.cargarLugares();
  }

  cargarLugares(): void {
    this.lugaresService.getLugares().subscribe({
      next: (data) => {
        this.lugares = data;
        this.isLoading = false;
        this.lugaresFiltrados = [...this.lugares];
        console.log('Lugares cargados:', data);
      },
      error: (err) => {
        console.error('Error al obtener lugares:', err);
      }
    });
  }

  ngDoCheck(): void {
    const texto = this.filtroBusqueda.toLowerCase();

    this.lugaresFiltrados = this.lugares.filter((lugar) => {
      if (!texto) return true;

      switch (this.columnaBusqueda) {
        case 'nombre':
          return lugar.nombre?.toLowerCase().includes(texto);
        case 'direccion':
          return lugar.direccion?.toLowerCase().includes(texto);
        case 'estado':
          return lugar.estado?.toLowerCase().includes(texto);
        default:
          return false;
      }
    });
  }

  editar(id: string): void {
    this.router.navigate([`/editlugar/${id}`]);
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
        this.lugaresService.deleteLugar(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'El lugar ha sido eliminado correctamente.'
            });
            this.cargarLugares();
          },
          error: (error) => {
            console.error('Error al eliminar lugar:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el lugar.'
            });
          }
        });
      }
    });
  }
  
}