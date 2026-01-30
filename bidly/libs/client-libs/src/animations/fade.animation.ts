import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const FADE_IN = trigger('fadeIn', [
  state('in', style({ opacity: 0 })),
  transition(':leave', [
    style({ opacity: 1 }),
    group([animate(`0ms ease-in-out`, style({ opacity: '0' }))]),
  ]),
  transition(':enter', [
    style({ opacity: 0 }),
    group([animate(`200ms ease-in-out`, style({ opacity: '1' }))]),
  ]),
]);
