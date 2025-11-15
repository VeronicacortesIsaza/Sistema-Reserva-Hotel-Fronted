import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PaginationParams } from '../../../core/models/api-response.model';
import { AuthService } from '../../../core/services/auth.service';
import { TipoHabitacionService } from '../../../core/services/tipohabitacion.service';
import { CreateTipoHabitacionRequest, TipoHabitacion, TipoHabitacionFilters, UpdateTipoHabitacionRequest } from '../../../shared/models/tipohabitacion.model';

@Component({
  selector: 'app-tipohabitacion-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo_habitacion-list.component.html',
  styleUrls: ['./tipo_habitacion-list.component.scss']
})
export class TipoHabitacionListComponent implements OnInit {
  tiposHabitacion: TipoHabitacion[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  
  searchIdInput = new Subject<string>();

  filters: TipoHabitacionFilters = {
    buscar: '',
  };

  showModal = false;
  editingTipo: TipoHabitacion | null = null;
  tipoForm = {
    nombre_tipo: '',
    descripcion: '',
  };

  constructor(private tipoHabitacionService: TipoHabitacionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
  this.loadTiposHabitacion();

  this.searchIdInput
    .pipe(debounceTime(300))
    .subscribe((id) => {
      this.buscarPorIdDebounced(id);
    });
}


  loadTiposHabitacion(): void {
  this.loading = true;
  const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };

  this.tipoHabitacionService.getTiposHabitacion(pagination).subscribe({
    next: (response) => {
      this.tiposHabitacion = response;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al cargar tipos de habitación:', error);
      this.loading = false;
    }
  });
}
buscarPorIdDebounced(id: string): void {
  if (!id || !id.trim()) {
    this.loadTiposHabitacion();
    return;
  }

  this.loading = true;

  this.tipoHabitacionService.getTipoHabitacionById(id).subscribe({
    next: (tipo) => {
      this.tiposHabitacion = [tipo];
      this.totalPages = 1;
      this.loading = false;
    },
    error: () => {
      this.tiposHabitacion = [];
      this.loading = false;
    }
  });
}

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadTiposHabitacion();
  }

  clearFilters(): void {
    this.filters = { buscar: "" };
    this.currentPage = 1;
    this.loadTiposHabitacion();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTiposHabitacion();
    }
  }

  openCreateModal(): void {
    this.editingTipo = null;
    this.tipoForm = { nombre_tipo: '', descripcion: ''};
    this.showModal = true;
  }

  editTipo(tipo: TipoHabitacion): void {
    this.editingTipo = tipo;
    this.tipoForm = {
      nombre_tipo: tipo.nombre_tipo,
      descripcion: tipo.descripcion || '',
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingTipo = null;
    this.tipoForm = { nombre_tipo: '', descripcion: ''};
  }

 saveTipo(): void {
  const userId = this.authService.getCurrentUserId();
    if (!userId) {
      alert('Debe iniciar sesión para guardar la habitación.');
      return;
    } 
  if (!this.tipoForm.nombre_tipo.trim()) {
    alert('El nombre del tipo de habitación es obligatorio');
    return;
  }

  if (this.editingTipo) {
    const updateData: UpdateTipoHabitacionRequest = {
      nombre_tipo: this.tipoForm.nombre_tipo,
      descripcion: this.tipoForm.descripcion,
      id_usuario_edita: userId
    };

    this.tipoHabitacionService.updateTipoHabitacion(this.editingTipo.id_tipo, updateData).subscribe({
      next: () => {
        this.loadTiposHabitacion();
        this.closeModal();
        alert('Tipo de habitacion actualizada correctamente')
      },
      error: (error) => {
        console.error('Error al actualizar tipo de habitación:', error);
        alert('Error al actualizar el tipo de habitación');
      }
    });
  } else {
    const createData: CreateTipoHabitacionRequest = {
      nombre_tipo: this.tipoForm.nombre_tipo,
      descripcion: this.tipoForm.descripcion,
      id_usuario_crea: userId
    };
    this.tipoHabitacionService.createTipoHabitacion(createData).subscribe({
      next: () => {
        this.loadTiposHabitacion();
        this.closeModal();
        alert('Tipo de habitacion creada correctamente');
      },
      error: (error) => {
        console.error('Error al crear tipo de habitación:', error);
        alert('Error al crear el tipo de habitación');
      }
    });
  }
}


  deleteTipo(tipo: TipoHabitacion): void {
    if (confirm(`¿Está seguro de eliminar el tipo de habitación "${tipo.nombre_tipo}"?`)) {
      this.tipoHabitacionService.deleteTipoHabitacion(tipo.id_tipo).subscribe({
        next: () => {
          this.loadTiposHabitacion(),
          alert('Tipo de habitacion eliminada correctamente')
        },
        error: (error) => console.error('Error al eliminar tipo de habitación:', error)
      });
    }
  }
}
