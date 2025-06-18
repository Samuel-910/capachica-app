import { Component, OnInit, DoCheck } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../sidebar/navbar/navbar.component';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { LugaresService } from '../../core/services/lugar.service';
import { BusquedaGlobalService, FiltrosBusqueda } from '../../core/services/busqueda-global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emprendimiento',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './emprendimiento.component.html',
  styleUrls: ['./emprendimiento.component.css']
})
export class EmprendimientoComponent implements OnInit, DoCheck {
  filtroBusqueda: string = '';
  columnaBusqueda: string = 'nombre';
  emprendimientos: any[] = [];
  emprendimientosFiltrados: any[] = [];
  paginaActual = 1;
  limitePorPagina = 10;
  isLoading = false;
  lugaresMap: Record<number, string> = {};

  constructor(
    private emprendimientoService: EmprendimientoService,
    private lugarService: LugaresService,
    private router: Router,
    private busquedaService: BusquedaGlobalService
  ) { }

  ngOnInit(): void {
    this.busquedaService.getFiltros().subscribe(f => this.aplicarFiltros(f));

    this.lugarService.listarLugares().subscribe({
      next: (lugares: any[]) => {
        lugares.forEach(l => this.lugaresMap[l.id] = l.nombre);
        this.cargarEmprendimientos();
      },
      error: () => {
        this.cargarEmprendimientos();
      }
    });
  }

  cargarEmprendimientos(): void {
    this.isLoading = true;
    this.emprendimientoService.listarEmprendimientosa(this.paginaActual, this.limitePorPagina)
      .subscribe({
        next: (res: any[]) => {
          this.emprendimientos = res.map(emp => ({
            ...emp,
            lugarNombre: this.lugaresMap[emp.lugarTuristicoId] || 'Sin asignar'
          }));
          this.emprendimientosFiltrados = [...this.emprendimientos];
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error al cargar emprendimientos:', err);
          this.isLoading = false;
          Swal.fire('Error', 'No se pudieron cargar los emprendimientos. Intenta nuevamente.', 'error');
        }
      });
  }

  ngDoCheck(): void {
    const texto = this.filtroBusqueda.toLowerCase();

    this.emprendimientosFiltrados = this.emprendimientos.filter((e) => {
      if (!texto) return true;

      switch (this.columnaBusqueda) {
        case 'nombre':
          return e.nombre?.toLowerCase().includes(texto);
        case 'descripcion':
          return e.descripcion?.toLowerCase().includes(texto);
        case 'categoria':
          return e.tipo?.toLowerCase().includes(texto);
        case 'lugar':
          return e.lugarNombre?.toLowerCase().includes(texto);
        case 'estado':
          return e.estado?.toLowerCase().includes(texto);
        default:
          return false;
      }
    });
  }

  getEmprendimientosPaginados(): any[] {
    const start = (this.paginaActual - 1) * this.limitePorPagina;
    return this.emprendimientosFiltrados.slice(start, start + this.limitePorPagina);
  }

  paginaSiguiente(): void {
    const totalPaginas = Math.ceil(this.emprendimientosFiltrados.length / this.limitePorPagina);
    if (this.paginaActual < totalPaginas) {
      this.paginaActual++;
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  editar(id: string): void {
    this.router.navigate([`/emprendimientos/editar/${id}`]);
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
    }).then(result => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.emprendimientoService.eliminarEmprendimiento(id).subscribe({
          next: () => {
            this.emprendimientos = this.emprendimientos.filter(emp => emp.id !== id);
            this.emprendimientosFiltrados = [...this.emprendimientos];
            Swal.fire('Eliminado', 'El emprendimiento ha sido eliminado.', 'success');
          },
          error: (err: any) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el emprendimiento. Intenta nuevamente.', 'error');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }

  private aplicarFiltros(f: FiltrosBusqueda) {
    if (f.tipo !== 'emprendimientos') return;

    this.emprendimientoService.buscarConFiltros({
      nombre: f.nombre,
      lugar: f.lugar,
      fechaDesde: f.fechaDesde,
      fechaHasta: f.fechaHasta
    }).subscribe(res => {
      this.emprendimientos = res;
      this.emprendimientosFiltrados = [...res];
    });
  }
}
