import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CreateUsuarioRequest, UpdateUsuarioRequest, Usuario, UsuarioFilters } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss']
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: UsuarioFilters = {};
  private searchSubject = new Subject<void>();
  showModal = false;
  editingUsuario: Usuario | null = null;
  usuarioForm: CreateUsuarioRequest = {
    nombre: '',
    apellidos: '',
    telefono: '',
    nombre_usuario: '',
    clave: '',
    tipo_usuario: 'Cliente'
  };

  constructor(private usuarioService: UsuarioService) { }
  ngOnInit(): void {
    this.totalPages = 1;
    this.loadUsuarios();

    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  onFilterChange(): void {
    this.searchSubject.next();
  }

 loadUsuarios(): void {
  this.loading = true;
  const pagination = { page: this.currentPage - 1, limit: this.pageSize };

  this.usuarioService.getUsuarios(pagination).subscribe({
    next: (usuarios) => {
      this.usuarios = usuarios;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar usuarios:', err);
      this.loading = false;
    }
  });
}

private isUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
}

applyFilters(): void {
  this.loading = true;

  const busqueda = this.filters.busqueda?.trim();
  const tipo = this.filters.tipo_usuario?.trim();
  const pagination = { page: 0, limit: 100 };

  if (busqueda && this.isUUID(busqueda)) {
    this.usuarioService.getUsuarioById(busqueda).subscribe({
      next: (usuario) => {
        this.usuarios = usuario ? [usuario] : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al buscar usuario por ID:', err);
        this.usuarios = [];
        this.loading = false;
      }
    });
    return;
  }

  if (busqueda) {
    this.usuarioService.getUsuarioByNombreUsuario(busqueda).subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios ? [usuarios] : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al buscar por nombre:', err);
        this.usuarios = [];
        this.loading = false;
      }
    });
    return;
  }

  if (tipo) {
    let request$;

    if (tipo === 'Administrador') {
      request$ = this.usuarioService.getUsuariosAdministradores();
    } else if (tipo === 'Cliente') {
      request$ = this.usuarioService.getUsuariosClientes();
    } else {
      this.usuarios = [];
      this.loading = false;
      return;
    }

    request$.subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al filtrar por tipo:', err);
        this.loading = false;
      }
    });

    return;
  }

  this.usuarioService.getUsuarios(pagination).subscribe({
    next: (usuarios) => {
      this.usuarios = usuarios;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar usuarios:', err);
      this.loading = false;
    }
  });
}


  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadUsuarios();
  }

  goToPage(page: number): void {
    if (page >= 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsuarios();
    }
  }

  openCreateModal(): void {
    this.editingUsuario = null;
    this.usuarioForm = {
      nombre: '',
      apellidos: '',
      telefono: '',
      nombre_usuario: '',
      clave: '',
      tipo_usuario: 'Cliente'
    };
    this.showModal = true;
  }

  editUsuario(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioForm = {
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      telefono: usuario.telefono,
      nombre_usuario: usuario.nombre_usuario,
      clave: '',
      tipo_usuario: usuario.tipo_usuario
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUsuario = null;
    this.usuarioForm = {
      nombre: '',
      apellidos: '',
      telefono: '',
      nombre_usuario: '',
      clave: '',
      tipo_usuario: 'Cliente'
    };
  }

  saveUsuario(): void {
    if (this.editingUsuario) {
      if (
        !this.usuarioForm.nombre.trim() ||
        !this.usuarioForm.apellidos.trim() ||
        !this.usuarioForm.telefono.trim()
      ) {
        alert('Todos los campos son obligatorios');
        return;
      }
    } else {
      if (
        !this.usuarioForm.nombre.trim() ||
        !this.usuarioForm.apellidos.trim() ||
        !this.usuarioForm.telefono.trim() ||
        !this.usuarioForm.nombre_usuario.trim() ||
        !this.usuarioForm.clave.trim()
      ) {
        alert('Todos los campos son obligatorios');
        return;
      }
    }
    
    if (this.editingUsuario) {
      const updateData: UpdateUsuarioRequest = {
        nombre: this.usuarioForm.nombre,
        apellidos: this.usuarioForm.apellidos,
        telefono: this.usuarioForm.telefono,
        tipo_usuario: this.usuarioForm.tipo_usuario,
      };

      this.usuarioService.updateUsuario(this.editingUsuario.id_usuario, updateData).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
          alert('Usuario actualizado correctamente');
        },
        error: (error) => {
          if (error.error && error.error.detail) {
            alert(error.error.detail);
          } else {
            alert('Error al actualizar el usuario');
          }
        }
      });
    } else {
      const createData: CreateUsuarioRequest = {
        nombre: this.usuarioForm.nombre,
        apellidos: this.usuarioForm.apellidos,
        telefono: this.usuarioForm.telefono,
        nombre_usuario: this.usuarioForm.nombre_usuario,
        clave: this.usuarioForm.clave,
        tipo_usuario: this.usuarioForm.tipo_usuario
      };

      this.usuarioService.createUsuario(createData).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
          alert('Usuario creado correctamente');
        },
        error: (error) => {
          if (error.error && error.error.detail) {
            alert(error.error.detail);
          } else {
            alert('Error al crear el usuario');
          }
        }
      });
    }
  }

  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar al usuario "${usuario.nombre} ${usuario.apellidos}"?`)) {
      this.usuarioService.deleteUsuario(usuario.id_usuario).subscribe({
        next: () => {
          this.loadUsuarios();
          alert('Usuario eliminado correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }
}
