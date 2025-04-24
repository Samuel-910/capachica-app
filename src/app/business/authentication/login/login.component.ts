import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export  class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false; // Añadir esta propiedad para manejar la visibilidad de la contraseña

  constructor(private authService: AuthService, private router: Router) {}

  // Función para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    console.log('Login con:', this.email, this.password);
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.roles[0];
        console.log(payload);
        console.log(role);
        if (role === 'admin') {
          this.router.navigate(['/dashboard']);
          // window.location.href = 'https://v0-desarrollar-vista-shadcn.vercel.app/';
          // Mostrar SweetAlert de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión como administrador.',
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.router.navigate(['/']);
          // Mostrar SweetAlert de éxito para usuarios comunes
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión correctamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        // Mostrar mensaje de error con SweetAlert
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Hubo un problema al iniciar sesión. Verifica tus credenciales.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
