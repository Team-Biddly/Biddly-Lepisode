import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export const ButtonType = {
    default: 'default',
    primary: 'primary',
    ghost: 'ghost',
    danger: 'danger',
} as const;

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.html',
    styleUrl: './button.css',
})
export class Button {
    ButtonType = ButtonType;
    type = input<keyof typeof ButtonType>(ButtonType.default);
    disabled = input<boolean>(false);

    class = computed(() => {
        const baseClasses = [
            'flex',
            'rounded-lg',
            'items-center',
            'justify-center',
            'px-4',
            'py-2',
            'transition-all',
            'w-full',
            'font-medium',
            'hover:opacity-80',
        ];

        const isDisabled = this.disabled();
        const type = this.type();

        if (isDisabled) {
            baseClasses.push('cursor-not-allowed opacity-50');
        } else {
            baseClasses.push('cursor-pointer');
        }

        switch (type) {
            case ButtonType.default:
                baseClasses.push('border', 'border-zinc-400', 'text-zinc-500', 'hover:bg-zinc-100');
                break;
            case ButtonType.primary:
                baseClasses.push('bg-primary', 'text-black');
                break;
            case ButtonType.ghost:
                baseClasses.push('bg-transparent', 'text-current', 'hover:bg-base-200');
                break;
            case ButtonType.danger:
                baseClasses.push('bg-red-500', 'text-white', 'hover:bg-red-500');
                break;
        }

        return baseClasses.join(' ');
    });
}
