import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservaServicioService } from '../../../core/services/reservaservicio.service';
import { CreateReservaServicioRequest, ReservaServicio, ReservaServicioFilters } from '../../../shared/models/reservaservicio.model';

@Component({
  selector: 'app-reserva-servicio-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-servicio-list.component.html',
  styleUrls: ['./reserva-servicio-list.component.scss']
})
export class ReservaServicioListComponent implements OnInit {
  reservaServicios: ReservaServicio[] = [];
  reservaServiciosSimplificados: Array<{
    id_reserva: string;
    id_servicio: string;
    nombre_cliente: string;
    apellidos_cliente: string;
    telefono_cliente: string;
    nombre_servicio: string;
    descripcion_servicio: string;
    fecha_entrada: string;
    fecha_salida: string;
  }> = [];

  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: ReservaServicioFilters = {};
filterReserva: string = '';
filterServicio: string = '';
  showModal = false;
  editingReservaServicio: ReservaServicio | null = null;

  reservaServicioForm: CreateReservaServicioRequest = {
    id_reserva: '' as any,
    id_servicio: '' as any,
  };

  constructor(private reservaServicioService: ReservaServicioService) { }

  ngOnInit(): void {
    this.loadReservaServicios();
  }

  loadReservaServicios(): void {
    this.loading = true;

    this.reservaServicioService.getAllReservaServicios().subscribe({
      next: (response) => {
        this.reservaServicios = response;

        this.reservaServiciosSimplificados = this.reservaServicios.map(rs => ({
          id_reserva: rs.id_reserva,
          id_servicio: rs.id_servicio,
          nombre_cliente: rs.reserva?.usuario?.nombre || '',
          apellidos_cliente: rs.reserva?.usuario?.apellidos || '',
          telefono_cliente: rs.reserva?.usuario?.telefono || '',
          nombre_servicio: rs.servicio?.nombre_servicio || '',
          descripcion_servicio: rs.servicio?.descripcion || '',
          fecha_entrada: rs.reserva?.fecha_entrada || '',
          fecha_salida: rs.reserva?.fecha_salida || '',
        }));

        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar:', error);
        this.loading = false;
      }
    });
  }

applyFilters(): void {
  this.loading = true;

  // Si hay id_reserva
  if (this.filterReserva) {
    this.reservaServicioService.getPorReserva(this.filterReserva).subscribe({
      next: (res) => {
        let filtered = res;

        // Si también hay id_servicio, filtramos localmente
        if (this.filterServicio) {
          filtered = filtered.filter(r => r.id_servicio === this.filterServicio);
        }

        this.reservaServicios = filtered;
        this.updateSimplificados();
        this.loading = false;
      },
      error: () => {
        this.reservaServicios = [];
        this.reservaServiciosSimplificados = [];
        this.loading = false;
      }
    });
    return;
  }

  // Si solo hay id_servicio
  if (this.filterServicio) {
    this.reservaServicioService.getPorServicio(this.filterServicio).subscribe({
      next: (res) => {
        this.reservaServicios = res;
        this.updateSimplificados();
        this.loading = false;
      },
      error: () => {
        this.reservaServicios = [];
        this.reservaServiciosSimplificados = [];
        this.loading = false;
      }
    });
    return;
  }

  // Si no hay filtros, cargamos todo
  this.loadReservaServicios();
}


updateSimplificados(): void {
  this.reservaServiciosSimplificados = this.reservaServicios.map(rs => ({
    id_reserva: rs.id_reserva,
    id_servicio: rs.id_servicio,
    nombre_cliente: rs.reserva?.usuario?.nombre || '',
    apellidos_cliente: rs.reserva?.usuario?.apellidos || '',
    telefono_cliente: rs.reserva?.usuario?.telefono || '',
    nombre_servicio: rs.servicio?.nombre_servicio || '',
    descripcion_servicio: rs.servicio?.descripcion || '',
    fecha_entrada: rs.reserva?.fecha_entrada || '',
    fecha_salida: rs.reserva?.fecha_salida || ''
  }));
}

onFilterChange() {
  // Asignamos los filtros
  this.filters.id_reserva = this.filterReserva?.trim() || '';
  this.filters.id_servicio = this.filterServicio?.trim() || '';

  // Llamamos al backend solo si hay algún filtro o para refrescar la tabla
  this.applyFilters();
}

clearFilters(): void {
  this.filterReserva = '';
  this.filterServicio = '';
  this.filters = { id_reserva: '', id_servicio: '' };
  this.loadReservaServicios();
}

filterText: string = '';

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadReservaServicios();
    }
  }

  openCreateModal(): void {
    this.editingReservaServicio = null;
    this.reservaServicioForm = {
      id_reserva: '' as any,
      id_servicio: '' as any
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveReservaServicio(): void {
    if (!this.reservaServicioForm.id_reserva || !this.reservaServicioForm.id_servicio) {
      alert('Debe seleccionar la reserva y el servicio');
      return;
    }
    this.reservaServicioService.createReservaServicio(this.reservaServicioForm)
      .subscribe({
        next: () => {
          this.loadReservaServicios();
          this.closeModal();
          alert('Reserva-servicio creado correctamente');
        },
        error: (error) => {
          console.error('Error al crear reserva-servicio:', error);
          alert('Error al crear el registro');
        }
      });
  }

  deleteReservaServicio(reservaServicio: ReservaServicio): void {
    if (confirm(`¿Eliminar la asignación de servicio de la reserva ${reservaServicio.id_reserva}?`)) {
      this.reservaServicioService.deleteReservaServicio(reservaServicio.id_reserva)
        .subscribe({
          next: () => this.loadReservaServicios(),
          error: (error) => console.error('Error al eliminar:', error)
        });
    }
  }
}
