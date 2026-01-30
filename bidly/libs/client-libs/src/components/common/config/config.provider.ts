import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ComponentGlobalConfig } from './config.interface';
import { COMPONENT_GLOBAL_CONFIG_TOKEN } from './token.type';

export const provideComponentConfig = (
  config: ComponentGlobalConfig
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    { provide: COMPONENT_GLOBAL_CONFIG_TOKEN, useValue: config },
  ]);
};
