import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateTipoHabitacionRequest,
  TipoHabitacion,
  UpdateTipoHabitacionRequest
} from '../../shared/models/tipohabitacion.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './service';

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionService {
  private readonly endpoint = '/TipoDeHabitacion';

  constructor(private apiService: ApiService) {}

  getTiposHabitacion(
  pagination?: PaginationParams
): Observable<any[]> {
  return this.apiService.get<any[]>(this.endpoint);
}

  getTipoHabitacionById(id: string): Observable<TipoHabitacion> {
    return this.apiService.get<TipoHabitacion>(`${this.endpoint}/${id}`);
  }

  createTipoHabitacion(data: CreateTipoHabitacionRequest): Observable<TipoHabitacion> {
    return this.apiService.post<TipoHabitacion>(this.endpoint, data);
  }

  updateTipoHabitacion(id: string, data: UpdateTipoHabitacionRequest): Observable<TipoHabitacion> {
    return this.apiService.put<TipoHabitacion>(`${this.endpoint}/${id}`, data);
  }

  deleteTipoHabitacion(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
