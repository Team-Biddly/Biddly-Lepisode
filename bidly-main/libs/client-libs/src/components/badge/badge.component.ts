import { CommonModule } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { Color } from '../common/types';

export type BadgeVariant = 'outline' | 'dash' | 'soft' | 'ghost';

@Component({
  selector: 'app-badge',
  template: `
    <div class="badge" [ngClass]="[currentColor(), currentVariant()]">
      <ng-content />
    </div>
  `,
  imports: [CommonModule],
})
export class Badge {
  color = input<Color>('primary');
  variant = input<BadgeVariant>('soft');

  currentColor = computed(() => {
    switch (this.color()) {
      case 'primary':
        return 'badge-primary';
      case 'info':
        return 'badge-info';
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'error':
        return 'badge-error';
      case 'neutral':
        return 'badge-neutral';
      default:
        return 'badge-primary';
    }
  });

  currentVariant = computed(() => {
    switch (this.variant()) {
      case 'outline':
        return 'badge-outline';
      case 'dash':
        return 'badge-dash';
      case 'soft':
        return 'badge-soft';
      case 'ghost':
        return 'badge-ghost';
      default:
        return 'badge-soft';
    }
  });
}
