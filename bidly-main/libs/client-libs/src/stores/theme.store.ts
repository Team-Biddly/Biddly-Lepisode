import { computed, inject, Injectable } from '@angular/core';
import { BaseStore } from './base.store';
import { Theme } from '../components/common/config/config.interface';
import { LocalStorageService } from '../services/local-storage.service';

type State = {
  theme: Theme;
};

@Injectable({ providedIn: 'root' })
export class ThemeStore extends BaseStore<State> {
  private readonly localStorageService = inject(LocalStorageService);

  theme = computed(() => this.state()?.theme);

  constructor() {
    super({
      theme: 'light',
    });

    const theme = this.localStorageService.get<Theme>('theme');
    this.setTheme(theme || 'light');
  }

  setTheme(theme: Theme) {
    this.updateState({ theme });
    this.localStorageService.set('theme', theme);
  }
}
