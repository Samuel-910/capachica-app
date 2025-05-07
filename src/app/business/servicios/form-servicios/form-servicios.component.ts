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

  }
  
  
  guardar(): void {

  }
  
  loadEmprendimientoId(): void {
    const emprendimientoId = this.route.snapshot.paramMap.get('emprendimientoId');
    if (emprendimientoId) {
      this.servicioForm.patchValue({ emprendimientoId });
    }
  }

  loadServicioData(): void {

  }
  

  guardarServicio(): void {
    
  }
  
  
  

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}
