export type UUID = string;


/**
 * 🔹 Modelo principal de Servicio
 */
export interface Servicio {
  id_servicio: UUID;
  nombre_servicio: string;
  descripcion?: string;
  precio: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

/**
 * 🔹 Datos requeridos para crear un servicio
 */
export interface CreateServicioRequest {
  nombre_servicio: string;
  descripcion?: string;
  precio: number;
}

/**
 * 🔹 Datos opcionales para actualizar un servicio
 */
export interface UpdateServicioRequest {
  nombre_servicio?: string;
  descripcion?: string;
  precio?: number;
}

/**
 * 🔹 Filtros aplicables en la búsqueda o paginación de servicios
 */
export interface ServicioFilters {
  id_servicio?: UUID;
  buscar?: string;
}
