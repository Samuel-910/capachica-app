import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServiciosService } from '../../../core/services/servicios.service';

@Component({
  selector: 'app-form-servicios',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './form-servicios.component.html',
  styleUrls: ['./form-servicios.component.css']
})
export class FormServiciosComponent implements OnInit {
  servicioForm: FormGroup;
  isEdit: boolean = false;
  currentServicio: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private serviciosService: ServiciosService
  ) {
    this.servicioForm = this.fb.group({
      tipoServicioId: [null, Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioBase: ['', [Validators.required, Validators.min(1)]],
      moneda: ['', Validators.required],
      estado: ['', Validators.required],
      detallesServicio: this.fb.group({
        idiomas: [''],
        experiencia: ['']
      }),
      imagenes: [[]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.serviciosService.getServicioById(+id).subscribe((servicio: any) => {
        this.currentServicio = servicio;
        this.servicioForm.patchValue(servicio);
      });
    }
  }
  
  
  guardar(): void {
    if (this.servicioForm.invalid) return;
  
    const data = this.servicioForm.value;
  
    if (this.isEdit && this.currentServicio?.id) {
      this.serviciosService.actualizarServicio(this.currentServicio.id, data).subscribe(() => {
        this.router.navigate(['/servicios']);
      });
    } else {
      const emprendimientoId = 1; // ajustar según lógica de negocio
      this.serviciosService.crearServicio(emprendimientoId, data).subscribe(() => {
        this.router.navigate(['/servicios']);
      });
    }
  }
  
  loadEmprendimientoId(): void {
    const emprendimientoId = this.route.snapshot.paramMap.get('emprendimientoId');
    if (emprendimientoId) {
      this.servicioForm.patchValue({ emprendimientoId });
    }
  }

  loadServicioData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.serviciosService.getServicioById(Number(id)).subscribe(
        (data) => {
          this.currentServicio = data;
          if (this.currentServicio && this.currentServicio.emprendimientoId) {
            this.servicioForm.patchValue({
              emprendimientoId: this.currentServicio.emprendimientoId
            });
          }
          this.servicioForm.patchValue(data);  // Rellenamos el formulario con los datos del servicio
        },
        (error) => {
          console.error('Error al cargar el servicio', error);
        }
      );
    } else {
      this.isEdit = false;
    }
  }
  

  guardarServicio(): void {
    if (this.servicioForm.valid) {
      const nuevoServicio = this.servicioForm.value;
      const emprendimientoId = this.servicioForm.value.emprendimientoId;
      
      if (!emprendimientoId) {
        console.error('Falta el emprendimientoId');
        return; // O mostrar un mensaje de advertencia al usuario
      }
  
      if (this.isEdit && this.currentServicio) {
        // Actualizar servicio
        this.serviciosService.actualizarServicio(this.currentServicio.id, nuevoServicio).subscribe(
          () => {
            this.router.navigate(['/servicios']);
          },
          (error) => {
            console.error('Error al actualizar el servicio', error);
          }
        );
      } else {
        // Crear servicio
        this.serviciosService.crearServicio(emprendimientoId, nuevoServicio).subscribe(
          () => {
            this.router.navigate(['/servicios']);
          },
          (error) => {
            console.error('Error al crear el servicio', error);
          }
        );
      }
    }
  }
  
  
  

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}
