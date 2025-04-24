import { Component, Input } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-emprendimiento',
  standalone: true,
  imports: [SidebarComponent,NavbarComponent, CommonModule, FormsModule],
  templateUrl: './form-emprendimiento.component.html',
  styleUrl: './form-emprendimiento.component.css'
})
export class FormEmprendimientoComponent {
  @Input() isEdit: boolean = false;

  form = {
    nombre: '',
    descripcion: '',
    tipo: 'Hospedaje',
    direccion: ''
  };
  constructor( private http: HttpClient,private router: Router) {}
  guardar(): void {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('https://capachica-tours-backend.vercel.app/api/emprendimientos', this.form, { headers })
      .subscribe({
        next: (response) => {
          console.log('Emprendimiento guardado:', response);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El emprendimiento ha sido guardado correctamente.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/emprendimiento']);
          });
        },
        error: (error) => {
          console.error('Error al guardar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'Ocurrió un problema al guardar el emprendimiento. Intenta nuevamente.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Cerrar'
        });
        }
      });
  }


  cancelar(): void {
    this.router.navigate(['/emprendimiento']);
  }
}
