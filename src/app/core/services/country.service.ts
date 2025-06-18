import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountryService {
    private readonly API = 'https://capachica-app-back-production.up.railway.app/countries';

    constructor(private http: HttpClient) { }

    listarCountries(): Observable<any[]> {
        return this.http.get<any[]>(this.API);
    }

    obtenerCountry(id: number): Observable<any> {
        return this.http.get<any>(`${this.API}/${id}`);
    }
}
