import { INavData } from '@coreui/angular';

// Función que devuelve el menú según el tipo de usuario
export function getNavItems(): INavData[] {
  const tipoUsuario = localStorage.getItem('tipo_usuario');

  if (tipoUsuario === 'Cliente') {
    // 🔹 Menú para CLIENTE
    return [
      {
        name: 'Perfil',
        url: 'perfil',
        iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'Reserva',
        url: 'reservas',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'Reserva servicio',
        url: 'reserva-servicio',
        iconComponent: { name: 'cil-notes' },
      },
    ];
  } else {
    // 🔹 Menú para ADMINISTRADOR (todas las opciones)
    return [
      {
        name: 'Perfil',
        url: 'perfil',
        iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'Usuarios',
        url: 'usuarios',
        iconComponent: { name: 'cil-user' },
      },
      {
        name: 'Habitaciones',
        url: 'habitaciones',
        iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Reserva',
        url: 'reservas',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'Tipo de habitación',
        url: 'tipo-habitacion',
        iconComponent: { name: 'cil-puzzle' },
      },
      {
        name: 'Servicios adicionales',
        url: 'servicios-adicionales',
        iconComponent: { name: 'cil-cursor' },
      },
      {
        name: 'Reserva servicio',
        url: 'reserva-servicio',
        iconComponent: { name: 'cil-notes' },
      },
    ];
  }
}
