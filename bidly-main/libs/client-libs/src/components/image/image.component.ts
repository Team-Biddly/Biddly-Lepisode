import { Component, input, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css',
})
export class Image {
  src = input.required<string>();

  loaded = signal<boolean>(false);
  error = signal<boolean>(false);

  onLoad() {
    this.loaded.set(true);
  }

  onError() {
    this.error.set(true);
  }
}
