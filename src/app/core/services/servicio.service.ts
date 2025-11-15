import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateServicioRequest,
  Servicio,
  ServicioFilters,
  UpdateServicioRequest
} from '../../shared/models/servicioadicional.model';
import {
  PaginationParams
} from '../models/api-response.model';
import { ApiService } from './service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private readonly endpoint = '/servicios_adicionales';

  constructor(private apiService: ApiService) {}

  /**
   * 🔹 Obtiene todos los servicios con paginación y filtros
   */
  getServicios(
    pagination: PaginationParams,
    filters?: ServicioFilters
  ): Observable<Servicio[]> {
    return this.apiService.getPaginated<Servicio>(this.endpoint, pagination, filters);
  }


  getServicioById(id: string): Observable<Servicio> {
    return this.apiService.get<Servicio>(`${this.endpoint}/${id}`);
  }

  /**
   * 🔹 Crea un nuevo servicio
   */
  createServicio(
    data: CreateServicioRequest
  ): Observable<Servicio> {
    return this.apiService.post<Servicio>(this.endpoint, data);
  }

  /**
   * 🔹 Actualiza un servicio existente
   */
  updateServicio(
    id: string,
    data: UpdateServicioRequest
  ): Observable<Servicio> {
    return this.apiService.put<Servicio>(`${this.endpoint}/${id}`, data);
  }

  /**
   * 🔹 Elimina un servicio por su ID
   */
  deleteServicio(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * 🔹 Obtiene todos los servicios sin paginación (si el backend lo permite)
   */
  getAllServicios(): Observable<Servicio[]> {
    return this.apiService.get<Servicio[]>(`${this.endpoint}`);
  }
}
