import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
    selector: 'app-label',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="flex gap-1 items-center">
            <label>
                <ng-content />
            </label>
            @if (required()) {
            <span class=" size-1.5 rounded-full bg-primary"></span>
            }
        </div>
    `,
})
export class Label {
    required = input<boolean>(false);
}
