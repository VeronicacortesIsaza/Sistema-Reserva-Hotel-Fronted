import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUsuarioRequest, UpdateUsuarioRequest, Usuario, UUID } from '../../shared/models/usuario.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly endpoint = '/usuarios';

  constructor(private apiService: ApiService) { }

  getUsuarios(pagination: PaginationParams): Observable<Usuario[]> {
    let query = `?skip=${pagination.page * pagination.limit}&limit=${pagination.limit}`;
    return this.apiService.get<Usuario[]>(`${this.endpoint}${query}`);
  }

  getUsuarioByNombreUsuario(nombreUsuario: string): Observable<Usuario> {
    const encoded = encodeURIComponent(nombreUsuario);
    return this.apiService.get<Usuario>(`${this.endpoint}/nombreusuario/${encoded}`);
  }

  getUsuarioById(id_usuario: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id_usuario}`);
  }
  createUsuario(usuario: CreateUsuarioRequest): Observable<Usuario> {
    return this.apiService.post<Usuario>(this.endpoint, usuario);
  }

  updateUsuario(id: UUID, usuario: UpdateUsuarioRequest): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  deleteUsuario(id: UUID): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getUsuariosAdministradores(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>(`${this.endpoint}/admin/lista`);
  }

  getUsuariosClientes(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>(`${this.endpoint}/cliente/lista`);
  }
}
