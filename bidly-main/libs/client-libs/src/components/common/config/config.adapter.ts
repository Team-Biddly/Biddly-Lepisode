import { computed, inject, signal } from '@angular/core';
import { ComponentGlobalConfig, Theme } from './config.interface';
import { COMPONENT_GLOBAL_CONFIG_TOKEN } from './token.type';
import { ThemeStore } from '../../../stores/theme.store';

export class BaseConfig {
  protected readonly themeStore = inject(ThemeStore);

  protected readonly globalConfig = signal<ComponentGlobalConfig>({});
  protected readonly theme = computed<Theme>(
    () => this.themeStore?.theme() || this.globalConfig()?.theme || 'light',
  );

  constructor() {
    const _globalConfig = inject(COMPONENT_GLOBAL_CONFIG_TOKEN, {
      optional: true,
    });

    if (_globalConfig) {
      this.globalConfig.set(_globalConfig);
    }
  }
}
