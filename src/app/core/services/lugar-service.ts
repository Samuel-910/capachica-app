import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface LugarTuristico {
  id?: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  coordenadas: string;
  horarioApertura: string;
  horarioCierre: string;
  costoEntrada: number;
  recomendaciones: string;
  restricciones: string;
  esDestacado: boolean;
  estado: string;
  imagenes: {
    url: string;
    descripcion: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class LugaresService {
  private apiUrl = 'https://capachica-app-back-production.up.railway.app/lugares-turisticos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo al login...');
      window.location.href = '/login'; // Redirige al usuario al login
      throw new Error('Token no encontrado');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getLugares(): Observable<LugarTuristico[]> {
    return this.http.get<LugarTuristico[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getLugar(id: string): Observable<LugarTuristico> {
    return this.http.get<LugarTuristico>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  crearLugar(lugar: LugarTuristico): Observable<any> {
    return this.http.post<any>(this.apiUrl, lugar, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error al crear el lugar:', error);
        return throwError(() => new Error('Error al crear el lugar'));
      })
    );
  }

  updateLugar(id: string, lugar: LugarTuristico): Observable<LugarTuristico> {
    return this.http.put<LugarTuristico>(`${this.apiUrl}/${id}`, lugar, {
      headers: this.getAuthHeaders()
    });
  }

  deleteLugar(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
