import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PaginationParams } from '../../../core/models/api-response.model';
import { AuthService } from '../../../core/services/auth.service';
import { HabitacionService } from '../../../core/services/habitacion.service';
import { TipoHabitacionService } from '../../../core/services/tipohabitacion.service';
import {
  CreateHabitacionRequest,
  Habitacion,
  UpdateHabitacionRequest
} from '../../../shared/models/habitacion.model';

@Component({
  selector: 'app-habitacion-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitacion-list.component.html',
  styleUrls: ['./habitacion-list.component.scss']
})
export class HabitacionListComponent implements OnInit {
  habitaciones: Habitacion[] = [];
  allHabitaciones: Habitacion[] = [];
  tiposHabitacion: any[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters = {
    busqueda: '',
    disponible: undefined as boolean | undefined
  };

  showModal = false;
  editingHabitacion: Habitacion | null = null;

  habitacionForm = {
    numero: 0,
    id_tipo: '',
    tipo: undefined as string | undefined,
    precio: 0,
    disponible: true,
  };
  searchSubject = new Subject<void>();
  constructor(
    private habitacionService: HabitacionService,
    private tipoHabitacionService: TipoHabitacionService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.tipoHabitacionService.getTiposHabitacion().subscribe({
      next: tipos => {
        this.tiposHabitacion = tipos;
        this.loadHabitaciones();
      },
      error: () => {
        this.tiposHabitacion = [];
        this.loadHabitaciones();
      }
    });
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  loadHabitaciones(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage - 1,
      limit: this.pageSize
    };

    this.habitacionService.getHabitaciones(pagination).subscribe({
      next: (response: any) => {
        this.habitaciones = Array.isArray(response)
          ? response
          : response?.data ?? response?.habitaciones ?? [];
        this.totalPages = response?.totalPages ?? response?.totalPaginas ?? 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar habitaciones:', error);
        this.habitaciones = [];
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loading = true;

    const busqueda = this.filters.busqueda?.trim();
    const disponible = this.filters.disponible;
    const pagination = { page: this.currentPage - 1, limit: this.pageSize };


    if (busqueda && !isNaN(Number(busqueda))) {
      this.habitacionService.getHabitacionPorNumero(busqueda).subscribe({
        next: (habitacion) => {
          this.habitaciones = habitacion ? [habitacion] : [];
          this.totalPages = 1;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al buscar habitación por número:', err);
          this.habitaciones = [];
          this.loading = false;
        }
      });
      return;
    }

    if (busqueda && isNaN(Number(busqueda))) {
      this.habitacionService.getHabitacionesPorTipo(busqueda).subscribe({
        next: (habitaciones) => {
          this.habitaciones = habitaciones;
          this.totalPages = 1;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al buscar por tipo:', err);
          this.habitaciones = [];
          this.loading = false;
        }
      });
      return;
    }

    if (disponible === true || disponible === false) {
      this.habitacionService.getHabitacionesDisponibles().subscribe({
        next: (habitaciones) => {
          this.habitaciones = disponible
            ? habitaciones
            : this.allHabitaciones.filter(h => !h.disponible);
          this.totalPages = 1;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al filtrar disponibles:', err);
          this.habitaciones = [];
          this.loading = false;
        }
      });
      return;
    }


    this.habitacionService.getHabitaciones(pagination).subscribe({
      next: (response: any) => {
        this.allHabitaciones = Array.isArray(response)
          ? response
          : response?.data ?? response?.habitaciones ?? [];
        this.habitaciones = this.allHabitaciones;
        this.totalPages = response?.totalPages ?? response?.totalPaginas ?? 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
        this.habitaciones = [];
        this.loading = false;
      }
    });
  }


  getNombreTipoHabitacion(idTipo: string): string {
    const tipo = this.tiposHabitacion.find((t: any) => t.id_tipo === idTipo);
    return tipo ? tipo.nombre_tipo : 'Sin tipo';
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = { busqueda: '', disponible: undefined };
    this.applyFilters();
  }

  openCreateModal(): void {
    this.editingHabitacion = null;
    this.habitacionForm = {
      numero: 0,
      id_tipo: '',
      tipo: '',
      precio: 0,
      disponible: true,
    };
    this.showModal = true;
  }

  editHabitacion(habitacion: Habitacion): void {
    this.editingHabitacion = habitacion;
    this.habitacionForm = {
      numero: habitacion.numero,
      id_tipo: habitacion.id_tipo,
      tipo: habitacion.tipo,
      precio: habitacion.precio,
      disponible: habitacion.disponible,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingHabitacion = null;
    this.habitacionForm = {
      numero: 0,
      id_tipo: '',
      tipo: '',
      precio: 0,
      disponible: true,
    };
  }

  saveHabitacion(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      alert('Debe iniciar sesión para guardar la habitación.');
      return;
    }

    const habitacionData: CreateHabitacionRequest | UpdateHabitacionRequest = {
      numero: Number(this.habitacionForm.numero),
      id_tipo: this.habitacionForm.id_tipo,
      precio: this.habitacionForm.precio,
      tipo: this.habitacionForm.tipo || '',
      disponible: this.habitacionForm.disponible,
      id_usuario_crea: userId,
      id_usuario_edita: userId,
    };

    const request$ = this.editingHabitacion
      ? this.habitacionService.updateHabitacion(
        this.editingHabitacion.id_habitacion!,
        habitacionData as UpdateHabitacionRequest
      )
      : this.habitacionService.createHabitacion(
        habitacionData as CreateHabitacionRequest
      );

    request$.subscribe({
      next: () => {
        this.loadHabitaciones();
        this.closeModal();
        alert('Correctamente')
      },
      error: (error) => {
        let mensaje = 'Error al guardar habitación';

        if (error?.error?.detail) {
          mensaje = `Error al guardar habitación: ${error.error.detail}`;
        }
        else if (error?.message && error.message.includes('400:')) {
          const detalle = error.message.split('400:')[1]?.trim();
          mensaje = `Error al guardar habitación: 400: ${detalle}`;
        }
        else if (error?.message) {
          mensaje = `Error al guardar habitación: ${error.message}`;
        }

        alert(mensaje);
        console.error('Error completo:', error);
      }
    });
  }

  deleteHabitacion(habitacion: Habitacion): void {
    if (confirm(`¿Eliminar la habitación ${habitacion.numero}?`)) {
      this.habitacionService.deleteHabitacion(
        habitacion.id_habitacion!
      ).subscribe({
        next: () => {
          this.loadHabitaciones(),
            alert('Habitacion eliminada correctamente')
        },
        error: () => alert('Error al eliminar habitación')
      });
    }
  }
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadHabitaciones();
  }
}
