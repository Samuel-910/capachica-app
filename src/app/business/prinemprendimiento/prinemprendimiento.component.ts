import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prinemprendimiento',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './prinemprendimiento.component.html',
  styleUrl: './prinemprendimiento.component.css'
})
export class PrinemprendimientoComponent implements OnInit{
  emprendimientos: any[] = [];

  constructor(private emprendimientoService: EmprendimientoService) {}

  ngOnInit(): void {
    this.emprendimientoService.listarEmprendimientos().subscribe(data => {
      this.emprendimientos = data.emprendimientos;
      console.log(data)
    });
  }
}
