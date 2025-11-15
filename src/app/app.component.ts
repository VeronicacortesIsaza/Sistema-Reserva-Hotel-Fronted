import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { delay, filter, map, tap } from 'rxjs/operators';

import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';

// 🔸 Importa TODOS los íconos que usarás en el sidebar
import {
  cilAccountLogout,
  cilBell,
  cilCommentSquare,
  cilCreditCard,
  cilCursor,
  cilEnvelopeOpen,
  cilFile,
  cilList,
  cilLockLocked,
  cilMenu,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSettings,
  cilSpeedometer,
  cilTask,
  cilUser
} from '@coreui/icons';

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'Hotel';

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);

  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);

  constructor() {
    // 🧭 Título inicial
    this.#titleService.setTitle(this.title);

    // 🌓 Configuración de modo de color (oscuro / claro)
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');

    // ✅ Aquí registras los íconos que usará el menú lateral
    this.#iconSetService.icons = {
      cilEnvelopeOpen,
      cilTask,
      cilCommentSquare,
      cilUser,
      cilSettings,
      cilCreditCard,
      cilFile,
      cilLockLocked,
      cilAccountLogout,
      cilMenu,
      cilBell,
      cilList,
      cilSpeedometer,
      cilPuzzle,
      cilNotes,
      cilPencil,
      cilCursor
    };
  }

  ngOnInit(): void {
    // 📌 Actualiza título y temas si cambian
    this.#router.events
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
      });

    // 🎨 Cambia el tema desde la URL si hay ?theme=dark/light/auto
    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.#colorModeService.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }
}
