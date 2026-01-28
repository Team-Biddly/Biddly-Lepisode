import { InjectionToken } from '@angular/core';
import { ComponentGlobalConfig } from './config.interface';

const TOKEN_VALUE = 'COMPONENT_GLOBAL_CONFIG_TOKEN';
export const COMPONENT_GLOBAL_CONFIG_TOKEN =
  new InjectionToken<ComponentGlobalConfig>(TOKEN_VALUE);
