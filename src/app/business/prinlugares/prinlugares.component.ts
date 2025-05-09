import { Component, OnInit } from '@angular/core';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { LugaresService } from '../../core/services/lugar.service';

@Component({
  selector: 'app-prinlugares',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './prinlugares.component.html',
  styleUrl: './prinlugares.component.css'
})
export class PrinlugaresComponent implements OnInit{
  lugares: any[] = [];

  constructor(private lugaresService: LugaresService) {}

  ngOnInit(): void {
    this.lugaresService.listarLugares().subscribe(data => {
      this.lugares = data;
      console.log(data)
    });
  }
}
