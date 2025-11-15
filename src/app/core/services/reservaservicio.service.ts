import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './service';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import {
  ReservaServicio,
  CreateReservaServicioRequest
} from '../../shared/models/reservaservicio.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservaServicioService {
  private readonly endpoint = '/reserva_servicios';

  constructor(private apiService: ApiService) { }

  getReservaServicios(): Observable<ReservaServicio[]> {
    return this.apiService.get<ReservaServicio[]>(`${this.endpoint}`);
  }

getPorReserva(id_reserva: string): Observable<ReservaServicio[]> {
  return this.apiService.get<ReservaServicio[]>(`${this.endpoint}/reserva/${id_reserva}`);
}

getPorServicio(id_servicio: string): Observable<ReservaServicio[]> {
  return this.apiService.get<ReservaServicio[]>(`${this.endpoint}/servicio/${id_servicio}`);
}


  createReservaServicio(
    data: CreateReservaServicioRequest
  ): Observable<ReservaServicio> {
    return this.apiService.post<ReservaServicio>(this.endpoint, data);
  }

  deleteReservaServicio(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getAllReservaServicios(): Observable<ReservaServicio[]> {
    return this.apiService.get<ReservaServicio[]>(`${this.endpoint}`);
  }
}
