import { ApiService } from './service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateReservaRequest, Reserva, ReservaFilters, UpdateReservaRequest } from '../../shared/models/reserva.model';
import { PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private readonly endpoint = '/reservas';
  
  constructor(private apiService: ApiService) { }

getReservas(pagination: PaginationParams): Observable<Reserva[]> {
    let query = `?skip=${pagination.page * pagination.limit}&limit=${pagination.limit}`;
    return this.apiService.get<Reserva[]>(`${this.endpoint}${query}`);
  }



  getReservaById(id: string): Observable<Reserva> {
    return this.apiService.get<Reserva>(`${this.endpoint}/${id}`);
  }


  createReserva(data: CreateReservaRequest): Observable<Reserva> {
    return this.apiService.post<Reserva>(this.endpoint, data);
  }

 
  updateReserva(id: string, data: UpdateReservaRequest): Observable<Reserva> {
    return this.apiService.put<Reserva>(`${this.endpoint}/${id}`, data);
  }


  deleteReserva(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
    getReservasActivas(): Observable<Reserva[]> {
    return this.apiService.get<Reserva[]>(`${this.endpoint}/reserva/activa`);
  }

  getReservasCanceladas(): Observable<Reserva[]> {
    return this.apiService.get<Reserva[]>(`${this.endpoint}/reserva/cancelada`);
  }
}
