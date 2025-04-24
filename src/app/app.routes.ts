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
      },
      {
        path: 'verificacion',
        loadComponent: () =>
          import('./business/authentication/password-recovery/password-recovery.component')
            .then(m => m.PasswordRecoveryComponent),
        // canActivate: [AuthenticatedGuard], // Eliminar el guard temporalmente
      },
      {
        path: 'verificacioncodigo',
        loadComponent: () =>
          import('./business/authentication/verification-code/verification-code.component')
            .then(m => m.VerificationCodeComponent),
      },
    ],
  },
  // Rutas privadas
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./business/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'emprendimiento',
        loadComponent: () =>
          import('./business/emprendimiento/emprendimiento.component').then(m => m.EmprendimientoComponent),
      },
      {
        path: 'newemprendimiento',
        loadComponent: () =>
          import('./business/emprendimiento/form-emprendimiento/form-emprendimiento.component').then(m => m.FormEmprendimientoComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./business/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'detalles/:id',
        loadComponent: () =>
          import('./business/detemprendedor/detemprendedor.component').then(m => m.DetemprendedorComponent),
      },
      {
        path: 'sidebar',
        loadComponent: () =>
          import('./business/sidebar/sidebar.component').then(m => m.SidebarComponent),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./business/role-list/role-list.component').then(m => m.RoleListComponent),
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
