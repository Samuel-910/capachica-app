import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_BASE         = 'https://capachica-tours-backend.vercel.app/api/auth';
  private readonly LOGIN_URL        = `${this.API_BASE}/login`;
  private readonly REGISTER_URL     = `${this.API_BASE}/register`;
  private readonly REFRESH_URL      = `${this.API_BASE}/refresh`;
  private readonly LOGOUT_URL       = `${this.API_BASE}/logout`;
  private readonly RESET_PASSWORD_URL       = `${this.API_BASE}/request-password-reset`;
  private readonly ME_URL           = `${this.API_BASE}/me`;

  private readonly tokenKey         = 'authToken';
  private readonly refreshTokenKey  = 'refreshToken';

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword(token: string, newPassword: string): Observable<any> {
    const resetData = { token, newPassword };  // Preparar los datos para el POST
    return this.http.post<any>('https://capachica-tours-backend.vercel.app/api/auth/reset-password', resetData, { withCredentials: true }).pipe(
      tap(() => console.log('Contraseña reseteada correctamente'))
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    const resetData = { email };  // Preparar los datos para el POST
    return this.http.post<any>(this.RESET_PASSWORD_URL, resetData, { withCredentials: true }).pipe(
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
          if (response.token) {
            console.log('Access Token:', response.token);
            this.setToken(response.token);

            if (response.refresh_token) {
              this.setRefreshToken(response.refresh_token);
              this.autoRefreshToken();
            }

            // ✅ Redirige al dashboard si todo fue bien
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(this.LOGOUT_URL, {}, { headers });
  }

  getMe(): Observable<any> {
    return this.http.get(this.ME_URL, { withCredentials: true });
  }

  private refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<any>(this.REFRESH_URL, { refresh_token: refreshToken }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.access_token) {
            this.setToken(response.access_token);
          }
        })
      );
  }

  private autoRefreshToken(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp     = payload.exp * 1000;
      const delay   = exp - Date.now() - 60_000;

      if (delay > 0) {
        setTimeout(() => this.refreshToken().subscribe(), delay);
      }
    } catch (err) {
      console.error('Error parsing token payload:', err);
    }
  }

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

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() < payload.exp * 1000;  // Verifica si el token no ha expirado
    } catch {
      return false;
    }
  }

}
