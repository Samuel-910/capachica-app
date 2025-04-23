import { Component }      from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { AuthService }    from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  rol = 'cliente';       // o el rol que por defecto quieras
  confirmPassword = '';         // <<< declara esto
  acceptedTerms = false;        // <<< y esto
  showPassword = false;

  constructor(private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // Envía sólo si el formulario estuviera validado
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      rol: this.rol
    }).subscribe({
      next: res => console.log('Usuario registrado:', res),
      error: err => console.error('Error al registrar:', err)
    });
  }
}
