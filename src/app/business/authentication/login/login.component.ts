import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
          window.location.href = 'https://v0-desarrollar-vista-shadcn.vercel.app/';
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => console.error('Login failed', err)
    });
  }
}
