export type UUID = string;


export interface Usuario {
  id_usuario: UUID;
  nombre: string;
  apellidos: string;
  telefono: string;
  nombre_usuario: string;
  tipo_usuario: string; 
  fecha_creacion: string;
  fecha_edita: string;
}

export interface CreateUsuarioRequest {
  nombre: string;
  apellidos: string;
  telefono: string;
  nombre_usuario: string,
  clave: string;
  tipo_usuario?: string;
}

export interface UpdateUsuarioRequest {
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  tipo_usuario?: string;
}


export interface UsuarioFilters {
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  nombre_usuario?: string;
  tipo_usuario?: string; 
  fecha_creacion?: string;
  fecha_edita?: string;
  busqueda?: string;    
}

