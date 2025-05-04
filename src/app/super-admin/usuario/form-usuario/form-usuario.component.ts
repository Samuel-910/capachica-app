import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../../../business/sidebar/sidebar.component';
import { NavbarComponent } from '../../../business/sidebar/navbar/navbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, ReactiveFormsModule],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  mostrarPassword: boolean = false;
  isEdit: boolean = false;
  usuarioIdEdit: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.usuarioForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        telefono: [''],
        direccion: [''],
        fotoPerfilUrl: [''],
        fechaNacimiento: [''],
        subdivisionId: [0],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: [this.passwordsIgualesValidator]
      }
    );

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.usuarioIdEdit = +id;

      this.authService.getUsuarioById(this.usuarioIdEdit).subscribe({
        next: (usuario) => {
          this.usuarioForm.patchValue({
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            fotoPerfilUrl: usuario.fotoPerfilUrl,
            fechaNacimiento: usuario.fechaNacimiento?.substring(0, 10),
            subdivisionId: usuario.subdivisionId,
            email: usuario.email,
            password: '',
            confirmPassword: ''
          });
          this.usuarioForm.get('email')?.disable();
        },
        error: (err) => {
          console.error('Error al cargar usuario:', err);
          Swal.fire('Error', 'No se pudo cargar el usuario.', 'error');
        }
      });
    }
  }

  passwordsIgualesValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  guardarUsuario() {
    if (this.usuarioForm.invalid) return;

    const formValue = this.usuarioForm.getRawValue();

    const usuario = {
      nombre: formValue.nombre,
      apellidos: formValue.apellidos,
      telefono: formValue.telefono,
      direccion: formValue.direccion,
      fotoPerfilUrl: formValue.fotoPerfilUrl,
      fechaNacimiento: formValue.fechaNacimiento,
      subdivisionId: +formValue.subdivisionId,
      email: formValue.email,
      password: formValue.password
    };

    if (this.isEdit && this.usuarioIdEdit) {
      this.authService.actualizarUsuario(this.usuarioIdEdit, usuario).subscribe({
        next: (res) => {
          console.log('Usuario actualizado:', res);
          Swal.fire('Actualizado', 'El usuario fue actualizado correctamente.', 'success');
          this.usuarioForm.reset();
          this.isEdit = false;
          this.usuarioIdEdit = null;
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
        }
      });
    } else {
      this.authService.register(usuario).subscribe({
        next: (res) => {
          console.log('Usuario registrado:', res);
          Swal.fire('Registrado', 'El usuario fue registrado correctamente.', 'success');
          this.usuarioForm.reset();
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error('Error al registrar:', err);
          Swal.fire('Error', 'No se pudo registrar el usuario.', 'error');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }
}
