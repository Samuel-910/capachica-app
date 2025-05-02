import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_BASE_login         = 'https://capachica-app-back-production.up.railway.app/auth';
  private readonly API_BASE_usuario         = 'https://capachica-app-back-production.up.railway.app/users';
  private readonly LOGIN_URL        = `${this.API_BASE_login}/login`;
  
  private readonly REGISTER_URL     = `${this.API_BASE_usuario}/register`;
  private readonly REQUEST_PASSWORD_URL       = `${this.API_BASE_usuario}/request-password-reset`;
  private readonly RESET_PASSWORD_URL       = `${this.API_BASE_usuario}/reset-password`;
  private readonly RESET_PASSWORD_ADMIN_URL       = `${this.API_BASE_usuario}/reset-password`;



  private readonly tokenKey         = 'authToken';
  private readonly refreshTokenKey  = 'refreshToken';

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword(token: string, newPassword: string): Observable<any> {
    const resetData = { token, newPassword };  // Preparar los datos para el POST
    return this.http.post<any>(this.RESET_PASSWORD_URL, resetData, { withCredentials: true }).pipe(
      tap(() => console.log('Contraseña reseteada correctamente'))
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    const resetData = { email };  // Preparar los datos para el POST
    return this.http.post<any>(this.REQUEST_PASSWORD_URL, resetData, { withCredentials: true }).pipe(
      tap(() => console.log('Se ha solicitado el reseteo de la contraseña'))
    );
  }

  register(userData: {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(this.REGISTER_URL, userData, { withCredentials: true }).pipe(
      tap(() => this.router.navigate(['/login']))
    );
  }


  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(this.LOGIN_URL, { email, password }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.access_token) {
            console.log('Access Token:', response.access_token);
            this.setToken(response.access_token);
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }
  

  // logout(): Observable<any> {
  //   const token = localStorage.getItem('authToken');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`
  //   });
  //   return this.http.post(this.LOGOUT_URL, {}, { headers });
  // }




  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.refreshTokenKey, token);
    }
  }

}
