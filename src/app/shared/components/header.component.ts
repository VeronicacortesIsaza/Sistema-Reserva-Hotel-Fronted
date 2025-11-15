import { Component } from '@angular/core';
import { SidebarService } from '@coreui/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  tipoUsuario = localStorage.getItem('tipoUsuario') || '';

  constructor(private sidebarService: SidebarService) {}

  toggleSidebar() {
    // Solo toggle, CoreUI gestiona la visibilidad
    this.sidebarService.toggle({ id: 'sidebar1' });
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
