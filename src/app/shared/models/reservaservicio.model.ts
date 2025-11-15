export type UUID = string;


export interface ReservaServicio {
  id_reserva: string;
  id_servicio: string;
  reserva?: {
    id_reserva: string;
    fecha_entrada: string;
    fecha_salida: string;
    usuario?: {
      nombre: string;
      apellidos: string;      // cambia apellidos → apellido si tu backend lo devuelve así
      telefono?: string;     // agrega telefono si quieres usarlo
    };
  };
  servicio?: {
    nombre_servicio: string;
    descripcion?: string;    // agrega descripcion si quieres usarlo
  };
}


export interface CreateReservaServicioRequest {
  id_reserva: UUID;
  id_servicio: UUID;
}

export interface UpdateReservaServicioRequest {
  id_reserva?: UUID;
  id_servicio?: UUID;
}

export interface ReservaServicioFilters {
  id_reserva?: UUID;
  id_servicio?: UUID;
}
