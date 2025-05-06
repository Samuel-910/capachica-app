import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TiposServicioService {
  public apiUrl = 'https://capachica-app-back-production.up.railway.app/servicios'; // ajusta tu URL base

  constructor(private http: HttpClient) {}

  // Crear un nuevo tipo de servicio
  crearTipoServicio(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Obtener todos los tipos de servicio
  obtenerTiposServicio(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un tipo de servicio por ID
  obtenerTipoServicio(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Eliminar un tipo de servicio por ID
  eliminarTipoServicio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
