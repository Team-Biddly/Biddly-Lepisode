import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const SLIDE_Y = trigger('slideY', [
  state('in', style({ opacity: 0 })),
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(50px)' }),
    group([
      animate(
        `300ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        style({ opacity: '1', transform: 'translateY(0)' }),
      ),
    ]),
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'translateY(0)' }),
    group([
      animate(
        `200ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        style({ opacity: '0', transform: 'translateY(50px)' }),
      ),
    ]),
  ]),
]);

export const SLIDE_X = trigger('slideX', [
  state('in', style({ opacity: 0 })),
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100px)' }),
    group([
      animate(
        `300ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        style({ opacity: '1', transform: 'translateX(0)' }),
      ),
    ]),
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'translateX(0)' }),
    group([
      animate(
        `0ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        style({ opacity: '0', transform: 'translateX(50px)' }),
      ),
    ]),
  ]),
]);
