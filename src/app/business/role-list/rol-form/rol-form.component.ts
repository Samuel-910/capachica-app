import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../../../business/sidebar/sidebar.component';
import { NavbarComponent } from '../../../business/sidebar/navbar/navbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RolesService } from '../../../core/services/roles.service';
import { PermissionsService } from '../../../core/services/permissions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-rol',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './rol-form.component.html',
  styleUrl: './rol-form.component.css'
})
export class RolFormComponent implements OnInit {
  rolForm!: FormGroup;
  isEdit: boolean = false;
  rolIdEdit: number | null = null;
  permisosDisponibles: any[] = [];
  permisosAsignadosIds: number[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly rolesService: RolesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly permissionsService: PermissionsService
  ) { }

  ngOnInit(): void {
    this.rolForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.rolIdEdit = +id;
      this.cargarRol(this.rolIdEdit); // ← Aquí ya se encargará de llamar a cargarPermisos()
    } else {
      this.cargarPermisos(); // Solo si estás creando un nuevo rol
    }
  }

  cargarRol(id: number): void {
    this.rolesService.obtenerRol(id).subscribe({
      next: (rol) => {
        this.rolForm.patchValue({
          nombre: rol.nombre,
          descripcion: rol.descripcion
        });

        // Obtener IDs de permisos ya asignados
        const permisosAsignadosIds = rol.rolesPermisos?.map((rp: any) => rp.permisoId) || [];

        // Guardar IDs temporalmente para usarlos al cargar los permisos
        this.permisosAsignadosIds = permisosAsignadosIds;

        // Ya que tenemos permisos del rol, ahora sí cargar todos los permisos
        this.cargarPermisos();
      },
      error: (err) => {
        console.error('Error al cargar rol:', err);
        Swal.fire('Error', 'No se pudo cargar el rol.', 'error');
      }
    });
  }

  cargarPermisos(): void {
    this.permissionsService.listarPermisos().subscribe({
      next: (data) => {
        this.permisosDisponibles = data.map((permiso: any) => ({
          ...permiso,
          seleccionado: this.permisosAsignadosIds.includes(permiso.id)
        }));
      },
      error: (err) => console.error('Error al cargar permisos:', err)
    });
  }

  guardarRol(): void {
    if (this.rolForm.invalid) return;

    const rolData = this.rolForm.value;
    const permisosSeleccionados = this.permisosDisponibles
      .filter(p => p.seleccionado)
      .map(p => p.id);

    if (permisosSeleccionados.length === 0) {
      Swal.fire('Advertencia', 'Debes seleccionar al menos un permiso.', 'warning');
      return;
    }

    const asignarPermisos = (rolId: number) => {
      let completados = 0;
      permisosSeleccionados.forEach((permisoId) => {
        this.rolesService.asignarPermiso(rolId, { permisoId }).subscribe({
          next: () => {
            completados++;
            if (completados === permisosSeleccionados.length) {
              Swal.fire(
                this.isEdit ? 'Actualizado' : 'Registrado',
                'El rol y sus permisos fueron guardados correctamente.',
                'success'
              );
              this.router.navigate(['/roles']);
            }
          },
          error: (err) => {
            console.error('Error al asignar permiso', permisoId, err);
            Swal.fire('Error', 'No se pudo asignar uno o más permisos.', 'error');
          }
        });
      });
    };

    if (this.isEdit && this.rolIdEdit) {
      this.rolesService.actualizarRol(this.rolIdEdit, rolData).subscribe({
        next: () => asignarPermisos(this.rolIdEdit!),
        error: (err) => {
          console.error('Error al actualizar rol:', err);
          Swal.fire('Error', 'No se pudo actualizar el rol.', 'error');
        }
      });
    } else {
      this.rolesService.crearRol(rolData).subscribe({
        next: (nuevoRol) => asignarPermisos(nuevoRol.id),
        error: (err) => {
          console.error('Error al registrar rol:', err);
          Swal.fire('Error', 'No se pudo registrar el rol.', 'error');
        }
      });
    }
  }



  cancelar(): void {
    this.router.navigate(['/roles']);
  }
}
