import { Component }      from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { Router, RouterModule }   from '@angular/router';
import { AuthService }    from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  nombre = '';
  apellidos = '';
  telefono = '';
  direccion = '';
  fotoPerfilUrl = '';
  fechaNacimiento = '';
  subdivisionId: number = 0;
  email = '';
  password = '';
  confirmPassword = '';
  acceptedTerms = false;
  showPassword = false;
  

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // Envía sólo si el formulario estuviera validado
    this.authService.register({
      nombre: this.nombre,
      apellidos: this.apellidos,
      telefono: this.telefono,
      direccion: this.direccion,
      fotoPerfilUrl: this.fotoPerfilUrl,
      fechaNacimiento: this.fechaNacimiento,
      subdivisionId: this.subdivisionId,
      email: this.email,
      password: this.password

    }).subscribe({
      next: res => {
        console.log('Usuario registrado:', res);
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta se ha creado correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/login']); // Redirige si deseas
        });
      },
      error: err => {
        console.error('Error al registrar:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: err?.error?.message || 'Hubo un problema al registrar tu cuenta. Intenta nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
