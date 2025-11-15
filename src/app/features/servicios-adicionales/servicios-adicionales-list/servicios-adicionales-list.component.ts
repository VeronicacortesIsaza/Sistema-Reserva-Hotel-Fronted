import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { AuthService } from '../../../core/services/auth.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { Servicio, ServicioFilters } from '../../../shared/models/servicioadicional.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-servicios-adicionales-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-adicionales-list.component.html',
  styleUrl: './servicios-adicionales-list.component.scss'
})
export class ServiciosAdicionalesListComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: ServicioFilters = {id_servicio: '', buscar: ''};

  showModal = false;
  editingServicio: Servicio | null = null;
  servicioForm = {
    nombre_servicio: '',
    descripcion: '',
    precio: 0
  };
searchSubject = new Subject<void>();
  constructor(private servicioService: ServicioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.totalPages = 1;
    this.loadServicios();
    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(() => this.loadServicios());
  }

  loadServicios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage - 1,
      limit: this.pageSize
    };

    this.servicioService.getServicios(pagination, this.filters).subscribe({
      next: (response) => {
        this.servicios = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
  if ((this.filters as any).id_servicio) {
    this.buscarPorId((this.filters as any).id_servicio);
    return;
  }

  this.loadServicios();
  }
buscarPorId(id: string): void {
  if (!id.trim()) {
    this.loadServicios();  
    return;
  }

  this.loading = true;

  this.servicioService.getServicioById(id).subscribe({
    next: (servicio) => {
      this.servicios = [servicio]; 
      this.loading = false;
      this.totalPages = 1;
      this.currentPage = 1;
    },
    error: () => {
      this.servicios = [];
      this.loading = false;
    }
  });
}

  clearFilters(): void {
    this.filters = {id_servicio: '',buscar: ''};
    this.currentPage = 1;
    this.loadServicios();
  }

  goToPage(page: number): void {
    if (page >= 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadServicios();
    }
  }

  openCreateModal(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      alert('Debe iniciar sesión para crear una habitación.');
      return;
    }
    this.editingServicio = null;
    this.servicioForm = {
      nombre_servicio: '',
      descripcion: '',
      precio: 0,
    };
    this.showModal = true;
  }

  editServicio(servicio: Servicio): void {
    this.editingServicio = servicio;
    this.servicioForm = {
      nombre_servicio: servicio.nombre_servicio,
      descripcion: servicio.descripcion || '',
      precio: servicio.precio
      
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingServicio = null;
    this.servicioForm = {
      nombre_servicio: '',
      descripcion: '',
      precio: 0
    };
  }

  saveServicio(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      alert('Debe iniciar sesión para crear una habitación.');
      return;
    }
    if (!this.servicioForm.nombre_servicio.trim()) {
      alert('El nombre del servicio es requerido');
      return;
    }

    if (this.servicioForm.precio <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    if (this.editingServicio) {
      const updateData = {
        nombre_servicio: this.servicioForm.nombre_servicio,
        descripcion: this.servicioForm.descripcion,
        precio: this.servicioForm.precio,
        id_usuario_edita: userId
      };

      this.servicioService.updateServicio(this.editingServicio.id_servicio, updateData).subscribe({
        next: () => {
          this.loadServicios();
          this.closeModal();
          alert('Servicio actualizado correctamente')
        },
        error: (error) => {
          console.error('Error al actualizar servicio:', error);
          alert('Error al actualizar el servicio');
        }
      });
    } else {
      const newServicio = {
        nombre_servicio: this.servicioForm.nombre_servicio,
        descripcion: this.servicioForm.descripcion,
        precio: this.servicioForm.precio,
        id_usuario_crea: userId
      };

      this.servicioService.createServicio(newServicio).subscribe({
        next: () => {
          this.loadServicios();
          this.closeModal();
          alert('Servicio creado correctamente')
        },
        error: (error) => {
          console.error('Error al crear servicio:', error);
          alert('Error al crear el servicio');
        }
      });
    }
  }

  deleteServicio(servicio: Servicio): void {
    if (confirm(`¿Está seguro de eliminar el servicio "${servicio.nombre_servicio}"?`)) {
      this.servicioService.deleteServicio(servicio.id_servicio).subscribe({
        next: () => {
          this.loadServicios();
          alert('Servicio eliminado correctamente')
        },
        error: (error) => {
          console.error('Error al eliminar servicio:', error);
        }
      });
    }
  }
}
