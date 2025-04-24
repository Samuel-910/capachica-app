import { Component, Input } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-emprendimiento',
  standalone: true,
  imports: [SidebarComponent,NavbarComponent, CommonModule, FormsModule],
  templateUrl: './form-emprendimiento.component.html',
  styleUrl: './form-emprendimiento.component.css'
})
export class FormEmprendimientoComponent {
  @Input() isEdit: boolean = false;

  form = {
    nombre: '',
    descripcion: '',
    tipo: 'Familia',
    direccion: ''
  };
  constructor( private router: Router) {}
  imagenPreview: string | ArrayBuffer | null = null;



  guardar(): void {
    // Aquí puedes usar FormData si vas a subir archivo
    console.log('Guardando', this.form);
  }

  cancelar(): void {
    this.router.navigate(['/emprendimiento']);
  }
}
