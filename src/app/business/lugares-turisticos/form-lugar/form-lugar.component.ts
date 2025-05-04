import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LugaresService } from '../../../core/services/lugar-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-lugar',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './form-lugar.component.html',
  styleUrls: ['./form-lugar.component.css']
})
export class FormLugarComponent implements OnInit {
  lugarForm!: FormGroup;
  isEdit = false;
  lugarId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private lugaresService: LugaresService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario
    this.lugarForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      direccion: ['', Validators.required],
      coordenadas: ['', Validators.required],
      horarioApertura: ['08:00', Validators.required],
      horarioCierre: ['17:00', Validators.required],
      costoEntrada: [0, [Validators.required, Validators.min(0)]],
      recomendaciones: ['', Validators.required],
      restricciones: ['', Validators.required],
      esDestacado: [false],
      estado: ['activo', Validators.required],
      imagenes: this.fb.array([])
    });

    // Verificar modo edición o creación
    this.lugarId = this.route.snapshot.paramMap.get('id');
    if (this.lugarId) {
      this.isEdit = true;
      this.loadLugar(this.lugarId);
    } else {
      // en creación, añadir un grupo de imagen inicial
      this.addImagen();
    }
  }

  private createImagenGroup(): FormGroup {
    return this.fb.group({
      url: [''],            // opcional
      descripcion: ['']     // opcional
    });
  }

  get imagenesFormArray(): FormArray {
    return this.lugarForm.get('imagenes') as FormArray;
  }

  get imagenesControls() {
    return this.imagenesFormArray.controls;
  }

  addImagen(): void {
    this.imagenesFormArray.push(this.createImagenGroup());
  }

  removeImagen(index: number): void {
    this.imagenesFormArray.removeAt(index);
  }

  loadLugar(id: string): void {
    this.isLoading = true;
    this.lugaresService.getLugar(id).subscribe({
      next: lugar => {
        this.lugarForm.patchValue(lugar);
        if (lugar.imagenes?.length) {
          this.imagenesFormArray.clear();
          lugar.imagenes.forEach((img: any) => {
            this.imagenesFormArray.push(this.fb.group(img));
          });
        }
        this.isLoading = false;
      },
      error: err => {
        console.error('Error al cargar lugar:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    console.log('onSubmit:', this.lugarForm.value, 'válido?', this.lugarForm.valid);
    if (this.lugarForm.invalid) {
      this.lugarForm.markAllAsTouched();
      return;
    }
  
    this.isLoading = true;
    const data = this.lugarForm.value;
    const request$ = this.isEdit
      ? this.lugaresService.updateLugar(this.lugarId!, data)
      : this.lugaresService.crearLugar(data); // El servicio maneja el Bearer token
  
    request$.subscribe({
      next: () => this.router.navigate(['/lugares-turisticos']),
      error: err => {
        console.error(this.isEdit ? 'Error al actualizar:' : 'Error al crear:', err);
        this.isLoading = false;
      }
    });
  }
  

  cancelar(): void {
    this.router.navigate(['/lugares-turisticos']);
  }
}
