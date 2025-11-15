import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];
    const tipoUsuario = localStorage.getItem('tipo_usuario');

    if (tipoUsuario && allowedRoles.includes(tipoUsuario)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
