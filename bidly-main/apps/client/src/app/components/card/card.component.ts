import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '@client-libs';
import { RouterLink } from '@angular/router';

interface Item {
  type: string;
  title: string;
  detail: string;
  manager: string;
  agency: string;
  budget: string;
  createdAt: string;
  period: string;
  keywords: string[];
}

@Component({
  selector: 'app-card',
  imports: [CommonModule, Icon, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  item = input<Item>({
    type: '',
    title: '',
    detail: '',
    manager: '',
    agency: '',
    budget: '',
    createdAt: '',
    period: '',
    keywords: [],
  });

  isBookMarked = signal(false);
}
