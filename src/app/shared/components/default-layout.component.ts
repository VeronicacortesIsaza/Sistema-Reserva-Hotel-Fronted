import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarModule, ContainerComponent } from '@coreui/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HeaderComponent } from './header.component'; // ✅
import { getNavItems } from './_nav';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarModule,
    ContainerComponent,
    NgScrollbarModule,
    HeaderComponent // ✅ ya puedes usarlo
  ]
})
export class DefaultLayoutComponent {
  public navItems = getNavItems();
}
