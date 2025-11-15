export type UUID = string;


export interface Reserva {
  id_reserva: UUID;
  id_usuario: UUID;
  id_habitacion: UUID;
  fecha_entrada: string;
  noches: number;
  fecha_salida: string;
  estado_reserva: string;
  numero_de_personas: number; 
  costo_total: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface CreateReservaRequest {
  id_usuario: UUID;
  id_habitacion: UUID;
  fecha_entrada: string;
  noches: number;
  estado_reserva?: string;
  numero_de_personas: number;
}

export interface UpdateReservaRequest {
  fecha_entrada?: string;
  noches?: number;
  estado_reserva?: string;
  numero_de_personas?: number;
}

export interface ReservaFilters {
  id_reserva?: UUID;
  estado_reserva?: string;
  buscar?: string; 
}
