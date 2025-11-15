export type UUID = string;


export interface TipoHabitacion {
  id_tipo: UUID;
  nombre_tipo: string;
  descripcion?: string;
  fecha_creacion: string;
  fecha_edicion: string;
}

export interface CreateTipoHabitacionRequest {
  nombre_tipo: string;
  descripcion?: string;
  id_usuario_crea: string;
}

export interface UpdateTipoHabitacionRequest {
  nombre_tipo?: string;
  descripcion?: string;
  id_usuario_edita: string;
}

/**
 * Filtros para búsqueda o paginación de tipos de habitación
 */
export interface TipoHabitacionFilters {
  id_tipo?: UUID;
  buscar?: string;
}
