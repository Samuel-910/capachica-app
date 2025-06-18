import { Component, OnInit, DoCheck } from '@angular/core';
import { SidebarComponent } from '../../business/sidebar/sidebar.component';
import { NavbarComponent } from '../../business/sidebar/navbar/navbar.component';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionsService } from '../../core/services/permissions.service';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent implements OnInit, DoCheck {
  filtroBusqueda: string = '';
  columnaBusqueda: string = 'nombre';
  isLoading = true;
  permisos: any[] = [];
  permisosFiltrados: any[] = [];

  constructor(
    private router: Router,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
  }

  cargarPermisos(): void {
    this.permissionsService.listarPermisos().subscribe({
      next: (data) => {
        this.permisos = data;
        this.permisosFiltrados = [...this.permisos];
        this.isLoading = false;
        console.log('Permisos cargados:', data);
      },
      error: (err) => {
        console.error('Error al obtener permisos:', err);
        this.isLoading = false;
      }
    });
  }

  ngDoCheck(): void {
    const texto = this.filtroBusqueda.toLowerCase();

    this.permisosFiltrados = this.permisos.filter((permiso) => {
      if (!texto) return true;

      switch (this.columnaBusqueda) {
        case 'nombre':
          return permiso.nombre?.toLowerCase().includes(texto);
        case 'descripcion':
          return permiso.descripcion?.toLowerCase().includes(texto);
        default:
          return false;
      }
    });
  }

  editar(id: number): void {
    this.router.navigate([`/editpermiso/${id}`]);
  }

  eliminarPermiso(id: number): void {
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
        this.permissionsService.eliminarPermiso(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El permiso ha sido eliminado correctamente.', 'success');
            this.cargarPermisos();
          },
          error: (error) => {
            console.error('Error al eliminar permiso:', error);
            Swal.fire('Error', 'No se pudo eliminar el permiso.', 'error');
          }
        });
      }
    });
  }
}
