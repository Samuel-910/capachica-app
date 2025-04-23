// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: '',
    children: [
      {
        // Ruta raíz: muestra el Home (landing)
        path: '',
        loadComponent: () =>
          import('./business/principal/principal.component').then(m => m.PrincipalComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./business/authentication/login/login.component').then(m => m.LoginComponent),
        //canActivate: [AuthenticatedGuard], // Eliminar el guard temporalmente
      },

      {
        path: 'register',
        loadComponent: () =>
          import('./business/authentication/register/register.component')
            .then(m => m.RegisterComponent),
        // canActivate: [AuthenticatedGuard], // Eliminar el guard temporalmente
      },
    ],
  },
  // Rutas privadas dentro de un layout con sidebar u otros elementos comunes
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    // canActivate: [AuthGuard], // Eliminar el guard temporalmente
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./business/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthenticatedGuard],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./business/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'tables',
        loadComponent: () =>
          import('./business/tables/tables.component').then(m => m.TablesComponent),
      },
      // Otras rutas privadas…
    ],
  },
  // Ruta comodín para redirección en caso de ruta no encontrada
  {
    path: '**',
    redirectTo: '',
  },
];
