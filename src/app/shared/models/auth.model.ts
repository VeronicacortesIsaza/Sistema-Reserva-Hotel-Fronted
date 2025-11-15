export interface Usuario {
  id_usuario: string;
  nombre: string;
  apellidos: string;
  telefono: string | null;
  tipo_usuario: string;
  nombre_usuario: string;
  clave?: string | null;
  fecha_creacion: string;
  fecha_edicion: string;
}

export interface LoginRequest {
  nombre_usuario: string;
  clave: string;
}

export interface LoginResponse {
  usuario: Usuario;
  access_token: string;
  token_type: string;
}
