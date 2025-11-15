import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guardar/auth.guard';
import { RoleGuard } from './features/auth/guardar/role.guard';

export const routes: Routes = [
  // Página inicial -> login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta del login
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },

  // Rutas internas (requieren autenticación)
  {
    path: '',
    loadComponent: () =>
      import('./shared/components').then(m => m.DefaultLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'usuarios',
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] },
        loadComponent: () =>
          import('./features/usuarios/usuarios-list/usuario-list.component')
            .then(m => m.UsuarioListComponent),
      },
      {
        path: 'perfil',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/perfil/perfil.component').then(m => m.PerfilComponent),
      },
      {
        path: 'reservas',
        canActivate: [RoleGuard],
        data: { roles: ['Administrador', 'Cliente'] },
        loadComponent: () =>
          import('./features/reservas/reservas-list/reserva-list.component')
            .then(m => m.ReservaListComponent),
      },
      {
        path: 'reserva-servicio',
        canActivate: [RoleGuard],
        data: { roles: ['Administrador', 'Cliente'] },
        loadComponent: () =>
          import('./features/reserva-servicio/reserva-servicio-list/reserva-servicio-list.component')
            .then(m => m.ReservaServicioListComponent),
      },
      {
        path: 'habitaciones',
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] },
        loadComponent: () =>
          import('./features/habitacion/habitacion-list/habitacion-list.component')
            .then(m => m.HabitacionListComponent),
      },
      {
        path: 'tipo-habitacion',
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] },
        loadComponent: () =>
          import('./features/tipo-habitacion/tipo-habitacion-list/tipo_habitacion-list.component')
            .then(m => m.TipoHabitacionListComponent),
      },
      {
        path: 'servicios-adicionales',
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] },
        loadComponent: () =>
          import('./features/servicios-adicionales/servicios-adicionales-list/servicios-adicionales-list.component')
            .then(m => m.ServiciosAdicionalesListComponent),
      },
    ],
  },

  // Cualquier otra ruta -> redirige al login
  { path: '**', redirectTo: 'login' },
];
