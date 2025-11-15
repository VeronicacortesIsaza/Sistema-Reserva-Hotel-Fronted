import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { AuthService } from '../../../core/services/auth.service';
import { HabitacionService } from '../../../core/services/habitacion.service';
import { ReservaService } from '../../../core/services/reserva.service';
import { TipoHabitacionService } from '../../../core/services/tipohabitacion.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Habitacion } from '../../../shared/models/habitacion.model';
import { Reserva, ReservaFilters } from '../../../shared/models/reserva.model';
import { Usuario } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-list.component.html',
  styleUrls: ['./reserva-list.component.scss']
})
export class ReservaListComponent implements OnInit {

  reservas: Reserva[] = [];
  habitaciones: Habitacion[] = [];
  habitacionesDisponibles: Habitacion[] = [];
  tiposHabitacion: any[] = [];
  usuarios: Usuario[] = [];
  todosLosUsuarios: any[] = [];

  cambiarHabitacion = false;
  habitacionActual: Habitacion | null = null;

  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: ReservaFilters = {};

  habitacionesMap: Record<string, string> = {};
  usuariosMap: Record<string, Usuario> = {};

  showModal = false;
  editingReserva: Reserva | null = null;
  tipoActual: any = null;

  reservaForm = {
    id_usuario: '',
    id_habitacion: '',
    numero_de_personas: 1,
    fecha_entrada: '',
    noches: 1,
    estado_reserva: 'Activa',
  };

  constructor(
    private reservaService: ReservaService,
    private habitacionService: HabitacionService,
    private tipoHabitacionService: TipoHabitacionService,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadTodosLosUsuarios();
    this.loadHabitaciones();
    this.loadTiposHabitacion();
    this.loadReservas();
  }
  loadTodosLosUsuarios(): void {
    const pagination: PaginationParams = { page: 0, limit: 1000 };
    this.usuarioService.getUsuarios(pagination).subscribe({
      next: (usuarios) => {
        this.todosLosUsuarios = usuarios;
      },
      error: () => { this.todosLosUsuarios = []; }
    });
  }


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadReservas();
    }
  }

  loadUsuarios(): void {
    const pagination: PaginationParams = { page: 0, limit: 2000 };

    this.usuarioService.getUsuarios(pagination).subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosMap = {};
        usuarios.forEach(u => this.usuariosMap[u.id_usuario] = u);
      },
      error: () => this.usuarios = []
    });
  }

  loadHabitaciones(): void {
    this.habitacionService.getHabitaciones({ page: 0, limit: 2000 }).subscribe({
      next: (response: any) => {
        this.habitaciones = Array.isArray(response) ? response : response?.data ?? [];

        this.habitacionesDisponibles = this.habitaciones.filter(h => h.disponible === true);

        this.habitacionesMap = {};
        this.habitaciones.forEach(h => {
          this.habitacionesMap[h.id_habitacion] = h.numero.toString();
        });
      },
      error: () => this.habitaciones = []
    });
  }

  loadTiposHabitacion(): void {
    this.tipoHabitacionService.getTiposHabitacion().subscribe({
      next: (response: any) => {
        this.tiposHabitacion = Array.isArray(response) ? response : response?.data ?? [];
      },
      error: () => this.tiposHabitacion = []
    });
  }

  loadReservas(): void {
    this.loading = true;

    const pagination: PaginationParams = {
      page: this.currentPage - 1,
      limit: this.pageSize
    };

    this.reservaService.getReservas(pagination).subscribe({
      next: (response) => {
        this.reservas = response.map((r: any) => ({
          ...r,
          fecha_entrada: r.fecha_entrada?.split('T')[0] ?? '',
          fecha_salida: r.fecha_salida?.split('T')[0] ?? ''
        }));

        this.loading = false;
      },
      error: () => {
        this.reservas = [];
        this.loading = false;
      }
    });
  }

  getNumeroHabitacion(id: string): string {
    return this.habitacionesMap[id] ?? 'Desconocido';
  }

  getNombreUsuario(id: string): string {
    const u = this.usuariosMap[id];
    return u ? `${u.nombre} ${u.apellidos}` : 'Desconocido';
  }

  getNombreTipoHabitacion(idTipo?: string): string {
    if (!idTipo) return 'Sin tipo';
    const tipo = this.tiposHabitacion.find(t => t.id_tipo === idTipo);
    return tipo ? tipo.nombre_tipo : 'Sin tipo';
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.filters.id_reserva && this.filters.id_reserva.trim() !== '') {
      this.reservaService.getReservaById(this.filters.id_reserva).subscribe({
        next: (res) => this.reservas = res ? [res] : [],
        error: () => this.reservas = []
      });
      return;
    }

    if (this.filters.estado_reserva) {
      let req$ =
        this.filters.estado_reserva === 'Activa'
          ? this.reservaService.getReservasActivas()
          : this.reservaService.getReservasCanceladas();

      req$.subscribe({
        next: (res) => this.reservas = res ?? [],
        error: () => this.reservas = []
      });
      return;
    }

    this.loadReservas();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadReservas();
  }

  openCreateModal(): void {
    this.editingReserva = null;
    this.reservaForm = {
      id_usuario: '',
      id_habitacion: '',
      fecha_entrada: '',
      noches: 1,
      estado_reserva: 'Activa',
      numero_de_personas: 1
    };
    this.showModal = true;
  }

  editReserva(reserva: Reserva): void {
    this.editingReserva = reserva;

    this.habitacionActual =
      this.habitaciones.find(h => h.id_habitacion === reserva.id_habitacion) ?? null;

    this.tipoActual =
      this.tiposHabitacion.find(t => t.id_tipo === this.habitacionActual?.id_tipo) ?? null;

    this.reservaForm = {
      id_usuario: reserva.id_usuario,
      id_habitacion: reserva.id_habitacion,
      fecha_entrada: reserva.fecha_entrada,
      noches: reserva.noches,
      estado_reserva: reserva.estado_reserva,
      numero_de_personas: reserva.numero_de_personas
    };

    this.showModal = true;
  }



  closeModal(): void {
    this.showModal = false;
  }

  saveReserva(): void {
  const userId = this.authService.getCurrentUserId();
  if (!userId) {
    alert('Debe iniciar sesión para crear una habitación.');
    return;
  }

  if (
    !this.reservaForm.id_usuario ||
    !this.reservaForm.id_habitacion ||
    !this.reservaForm.fecha_entrada ||
    !this.reservaForm.noches ||
    !this.reservaForm.numero_de_personas ||
    this.reservaForm.numero_de_personas <= 0
  ) {
    alert("Todos los campos son requeridos y el número de personas debe ser mayor a 0");
    return;
  }

  if (this.editingReserva) {

    const reservaOriginal = this.editingReserva;

    if (reservaOriginal.estado_reserva === "Cancelada") {

      const habitacionOriginal = this.habitaciones.find(
        h => h.id_habitacion === reservaOriginal.id_habitacion
      );

      if (!habitacionOriginal) {
        alert("No se encontró la habitación original de la reserva.");
        return;
      }

      if (!habitacionOriginal.disponible) {
        alert("No se puede usar la habitación original porque está ocupada");
        return;
      }
      this.reservaForm.id_habitacion = reservaOriginal.id_habitacion;
    }

    if (this.reservaForm.id_habitacion === reservaOriginal.id_habitacion) {
      const data: any = { ...this.reservaForm };
      delete data.id_habitacion;

      this.reservaService.updateReserva(reservaOriginal.id_reserva, data).subscribe({
        next: () => {
          this.loadReservas();
          this.closeModal();
          alert('Actualizada correctamente');
        },
        error: () => alert('Error al actualizar'),
      });

      return;
    }

    const habitacionNueva = this.habitaciones.find(
      h => h.id_habitacion === this.reservaForm.id_habitacion
    );

    if (habitacionNueva && !habitacionNueva.disponible) {
      alert("La nueva habitación no está disponible");
      return;
    }

    this.reservaService.updateReserva(reservaOriginal.id_reserva, this.reservaForm).subscribe({
      next: () => {
        this.loadReservas();
        this.closeModal();
        alert('Actualizada correctamente');
      },
      error: () => alert('Error al actualizar'),
    });

    return;
  }

  this.reservaService.createReserva(this.reservaForm).subscribe({
    next: () => {
      this.loadReservas();
      this.closeModal();
      alert('Creada correctamente');
    },
    error: () => alert('Error al crear la reserva'),
  });
}

  deleteReserva(reserva: Reserva): void {
    if (!confirm(`¿Eliminar reserva ${reserva.id_reserva}?`)) return;

    this.reservaService.deleteReserva(reserva.id_reserva).subscribe({
      next: () => {
        this.loadReservas();
        alert('Eliminada');
      },
      error: () => alert('Error al eliminar')
    });
  }

  activarCambioHabitacion() {
    this.cambiarHabitacion = true;
  }

  cancelarCambioHabitacion() {
    this.cambiarHabitacion = false;
  }

  get habitacionesForm(): Habitacion[] {
    if (this.editingReserva) {
      const actual = this.habitaciones.find(
        h => h.id_habitacion === this.editingReserva!.id_habitacion
      );

      const disponibles = this.habitacionesDisponibles.filter(
        h => h.id_habitacion !== this.editingReserva!.id_habitacion
      );

      return actual ? [actual, ...disponibles] : disponibles;
    }

    return this.habitacionesDisponibles;
  }
private actualizarReservaYHabitaciones(habitacionCambio: boolean) {

  if (!this.editingReserva) {
    alert("No hay una reserva seleccionada para actualizar");
    return;
  }

  const reservaEdit = this.editingReserva;
  const habitacionAnterior = reservaEdit.id_habitacion;

  this.reservaService.updateReserva(reservaEdit.id_reserva, this.reservaForm)
    .subscribe({
      next: () => {

        if (habitacionCambio) {

          this.habitacionService.cambiarEstadoHabitacion(
            habitacionAnterior,
            true
          ).subscribe();

          this.habitacionService.cambiarEstadoHabitacion(
            this.reservaForm.id_habitacion!,
            false
          ).subscribe();
        }

        this.loadReservas();
        this.closeModal();
        alert("Reserva actualizada");
      },
      error: () => alert("Error al actualizar")
    });
}

}
