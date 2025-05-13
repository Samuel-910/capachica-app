import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LugaresService } from '../../../core/services/lugar.service';
import { ResenaService } from '../../../core/services/resenas.service';
import { AuthService } from '../../../core/services/auth.service';
import { initFlowbite } from 'flowbite';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-detprinlugares',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './detprinlugares.component.html',
  styleUrls: ['./detprinlugares.component.css']
})
export class DetprinlugaresComponent implements OnInit {
  mapUrl!: SafeResourceUrl;
  lugar: any = {};
  resenas: any[] = [];
  usuarios: any = {};
  dateForm: FormGroup;
  nights: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private lugaresService: LugaresService,
    private fb: FormBuilder
  ) {
    this.dateForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
    this.dateForm.valueChanges.subscribe(values => {
      this.calculateNights(values.startDate, values.endDate);
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.obtenerLugar();
  }

obtenerLugar(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.lugaresService.getLugar(id).subscribe({
      next: (lugar) => {
        this.lugar = lugar;
        this.buildMapUrl(lugar.latitud, lugar.longitud);
        console.log("lugar detalle", this.lugar);
      },
      error: (err) => {
        console.error('Error al obtener detalles del lugar:', err);
      }
    });
  }
}
  private buildMapUrl(lat: number, lng: number): void {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

calculateNights(startDate: string, endDate: string): void {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    this.nights = differenceInTime / (1000 * 3600 * 24);
  } else {
    this.nights = null;
  }
}
}