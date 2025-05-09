import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LugaresService } from '../../../core/services/lugar.service';
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
      horarioApertura: ['null', Validators.required],
      horarioCierre: ['null', Validators.required],
      costoEntrada: [0, [Validators.required, Validators.min(0)]],
      recomendaciones: ['', Validators.required],
      restricciones: ['', Validators.required],
      esDestacado: [false],
      estado: ['activo', Validators.required],
      imagenes: this.fb.array([])  // Inicializar el array de imágenes
    });

    // Verificar si es edición o creación
    this.lugarId = this.route.snapshot.paramMap.get('id');
    if (this.lugarId) {
      this.isEdit = true;
      this.loadLugar(this.lugarId);
    } else {
      this.addImagen();  // Añadir imagen por defecto
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

        // Convertir los horarios a instancias de Date
        if (lugar.horarioApertura) {
          this.lugarForm.patchValue({
            horarioApertura: new Date(lugar.horarioApertura).toISOString().substring(11, 16)
          });
        }
        if (lugar.horarioCierre) {
          this.lugarForm.patchValue({
            horarioCierre: new Date(lugar.horarioCierre).toISOString().substring(11, 16)
          });
        }

        // Cargar las imágenes
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

  convertToDate(time: string): Date {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date;
  }

  onSubmit(): void {
    // Convertir los horarios a Date antes de enviar
    const data = this.lugarForm.value;
    data.horarioApertura = this.convertToDate(data.horarioApertura);
    data.horarioCierre = this.convertToDate(data.horarioCierre);

    if (this.lugarForm.invalid) {
      this.lugarForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const request$ = this.isEdit
      ? this.lugaresService.updateLugar(this.lugarId!, data)
      : this.lugaresService.crearLugar(data);

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
