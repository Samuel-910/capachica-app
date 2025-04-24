import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../sidebar/navbar/navbar.component';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-emprendimiento',
  standalone: true,
  imports: [SidebarComponent,NavbarComponent, CommonModule, RouterModule],
  templateUrl: './emprendimiento.component.html',
  styleUrl: './emprendimiento.component.css'
})
export class EmprendimientoComponent implements OnInit{
  emprendimientos: any[] = [];
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalElementos: number = 0;
  limitePorPagina: number = 10;

  constructor(private emprendimientoService:EmprendimientoService) {}

  ngOnInit(): void {
    this.cargarEmprendimientos();
  }


  cargarEmprendimientos(): void {
    this.emprendimientoService.listarEmprendimientos({
      page: this.paginaActual,
      limit: this.limitePorPagina
    }).subscribe({
      next: (res) => {
        this.emprendimientos = res.emprendimientos;
        this.totalPaginas = res.totalPages;
        this.totalElementos = res.total;
      },
      error: (err) => {
        console.error('Error al cargar emprendimientos:', err);
      }
    });
  }
  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarEmprendimientos();
    }
  }
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarEmprendimientos();
    }
  }
  getLimiteSuperior(): number {
    return Math.min(this.paginaActual * this.limitePorPagina, this.totalElementos);
  }


  editar(emp: any): void {
    // Aquí podrías redirigir a un formulario o abrir un modal con los datos
    console.log('Editar emprendimiento:', emp);
    Swal.fire('Editar', `Editando: ${emp.nombre}`, 'info');
  }

  eliminar(id: number): void {
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
        this.emprendimientoService.eliminarEmprendimiento(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El emprendimiento ha sido eliminado.', 'success');
            this.cargarEmprendimientos(); // Recarga la tabla
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el emprendimiento.', 'error');
          }
        });
      }
    });
  }
}
