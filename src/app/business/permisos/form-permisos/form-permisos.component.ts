import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../../../business/sidebar/sidebar.component';
import { NavbarComponent } from '../../../business/sidebar/navbar/navbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { PermissionsService } from '../../../core/services/permissions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-permiso',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './form-permisos.component.html',
  styleUrl: './form-permisos.component.css'
})
export class FormPermisosComponent implements OnInit {
  permisoForm!: FormGroup;
  isEdit: boolean = false;
  permisoIdEdit: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly permissionsService: PermissionsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.permisoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.permisoIdEdit = +id;
      this.cargarPermiso(this.permisoIdEdit);
    }
  }

  cargarPermiso(id: number): void {
    this.permissionsService.obtenerPermiso(id).subscribe({
      next: (permiso) => {
        this.permisoForm.patchValue({
          nombre: permiso.nombre,
          descripcion: permiso.descripcion
        });
      },
      error: (err) => {
        console.error('Error al cargar permiso:', err);
        Swal.fire('Error', 'No se pudo cargar el permiso.', 'error');
      }
    });
  }

  guardarPermiso(): void {
    if (this.permisoForm.invalid) return;

    const permisoData = this.permisoForm.value;

    if (this.isEdit && this.permisoIdEdit) {
      this.permissionsService.actualizarPermiso(this.permisoIdEdit, permisoData).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'El permiso fue actualizado correctamente.', 'success');
          this.router.navigate(['/permisos']);
        },
        error: (err) => {
          console.error('Error al actualizar permiso:', err);
          Swal.fire('Error', 'No se pudo actualizar el permiso.', 'error');
        }
      });
    } else {
      this.permissionsService.crearPermiso(permisoData).subscribe({
        next: () => {
          Swal.fire('Registrado', 'El permiso fue registrado correctamente.', 'success');
          this.router.navigate(['/permisos']);
        },
        error: (err) => {
          console.error('Error al registrar permiso:', err);
          Swal.fire('Error', 'No se pudo registrar el permiso.', 'error');
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/permisos']);
  }
}
