import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateHabitacionRequest,
  Habitacion,
  UpdateHabitacionRequest
} from '../../shared/models/habitacion.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './service';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private readonly endpoint = '/habitaciones';

  constructor(private apiService: ApiService) { }

  getHabitaciones(pagination?: PaginationParams): Observable<Habitacion[]> {
    const params = pagination
      ? `?skip=${pagination.page * pagination.limit}&limit=${pagination.limit}`
      : '';
    return this.apiService.get<Habitacion[]>(`${this.endpoint}${params}`);
  }
  cambiarEstadoHabitacion(id: string, disponible: boolean) {
    return this.apiService.patch(`${this.endpoint}/${id}/estado`, {
      disponible: disponible
    });
  }

  getHabitacionPorNumero(numero: string): Observable<Habitacion> {
    return this.apiService.get<Habitacion>(`${this.endpoint}/numero/${numero}`);
  }


  createHabitacion(habitacion: CreateHabitacionRequest): Observable<Habitacion> {
    return this.apiService.post<Habitacion>(this.endpoint, habitacion);
  }

  updateHabitacion(id: string, habitacion: UpdateHabitacionRequest): Observable<Habitacion> {
    return this.apiService.put<Habitacion>(`${this.endpoint}/${id}`, habitacion);
  }

  deleteHabitacion(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getHabitacionesDisponibles(): Observable<Habitacion[]> {
    return this.apiService.get<Habitacion[]>(`${this.endpoint}/estado`);
  }

  getHabitacionesPorTipo(tipo: string): Observable<Habitacion[]> {
    return this.apiService.get<Habitacion[]>(`${this.endpoint}/tipo/${encodeURIComponent(tipo)}`);
  }
}
