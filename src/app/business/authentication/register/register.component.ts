import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  countries: any[] = [];
  subdivisions: any[] = [];
  isLoadingCountries = true;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  showPassword = false;
  registerForm: FormGroup;
  subdivisionId = 0;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // Definimos el formulario
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      subdivisionId: ['', Validators.required], // Agregar subdivisionId
    });
  }

  ngOnInit(): void {
    this.cargarPaises();
  }

  cargarPaises(): void {
    fetch('https://capachica-app-back-production.up.railway.app/countries')
      .then(res => res.json())
      .then(data => {
        this.countries = data;
        this.isLoadingCountries = false;
      })
      .catch(err => {
        console.error('Error al cargar países:', err);
        this.isLoadingCountries = false;
      });
  }
  onPaisSeleccionado(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const paisId = selectElement.value;  // Aseguramos que `paisId` sea un string
    const pais = this.countries.find(c => c.id === +paisId); // Convertimos el valor a número
    this.subdivisions = pais?.subdivisions || [];
    this.subdivisionId = 0; // Reinicia la selección anterior
  }



  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async subirImagenASupabase(file: File): Promise<string> {
    Swal.fire({
      title: 'Subiendo imagen...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });

    const supabase = this.supabaseService.getClient();
    const path = `usuarios/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('usuarios').upload(path, file);
    if (error) {
      Swal.close();
      throw new Error(error.message);
    }
    const { data } = supabase.storage.from('usuarios').getPublicUrl(path);
    Swal.close();
    return data.publicUrl;
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos correctamente.', 'error');
      return;
    }

const { nombre, apellidos, telefono, fechaNacimiento, direccion, email, password, subdivisionId: rawSubdivisionId } = this.registerForm.value;

// Convierte a número
const subdivisionId = Number(rawSubdivisionId); 
    let fotoPerfilUrl = '';
    if (this.selectedFile) {
      try {
        fotoPerfilUrl = await this.subirImagenASupabase(this.selectedFile);
      } catch (error) {
        console.error('Error al subir imagen:', error);
        Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
        return;
      }
    }

    const payload = {
      email,
      password,
      nombre,
      apellidos,
      telefono,
      direccion,
      fechaNacimiento,
      fotoPerfilUrl,
      subdivisionId
    };

    this.authService.register(payload).subscribe({
      next: () => {
        Swal.fire('Registrado', 'El usuario fue registrado correctamente.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        Swal.fire('Error', 'No se pudo registrar el usuario.', 'error');
      }
    });
  }
}
