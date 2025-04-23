import { Routes } from '@angular/router';

export const routes: Routes = [
  // Rutas públicas
  {
    path: '',
    children: [
      {
        // Ruta raíz: muestra el Home (landing)
        path: '',
        loadComponent: () =>
          import('./principal/principal.component').then(m => m.PrincipalComponent),
      }
    ],
  },
];
