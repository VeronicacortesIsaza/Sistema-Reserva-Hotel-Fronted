// Modelo compartido: habitacion.model.ts
export interface CreateHabitacionRequest {
  numero: number;
  id_tipo: string;
  tipo?: string
  precio: number;
  disponible?: boolean;
  id_usuario_crea: string;
}

export interface UpdateHabitacionRequest {
  numero?: number;
  id_tipo?: string;
  tipo: string;
  precio?: number;
  disponible?: boolean;
  id_usuario_edita?: string;
  fecha_edicion?: Date;
}

export interface Habitacion {
  id_habitacion: string;
  numero: number;
  id_tipo: string;
  tipo?: string; 
  precio: number;
  disponible: boolean;
  fecha_creacion?: string;
  fecha_edicion?: string;
}

export interface HabitacionFilters {
  busqueda?: string;
  disponible?: boolean | null;
}
