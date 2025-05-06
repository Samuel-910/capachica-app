import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TiposServicioService {
  public apiUrl = 'https://capachica-app-back-production.up.railway.app/servicios'; // ajusta tu URL base

  constructor(private http: HttpClient) {}
  

   // Obtener todos los tipos de servicio
   obtenerTiposServicio(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener un tipo de servicio por ID
  obtenerTipoServicio(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo tipo de servicio
  crearTipoServicio(tipoServicio: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tipoServicio);
  }

  // Editar un tipo de servicio existente
  editarTipoServicio(id: number, tipoServicio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tipoServicio);
  }

  // Eliminar un tipo de servicio
  eliminarTipoServicio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
