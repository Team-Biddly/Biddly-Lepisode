import { Component } from '@angular/core';
import { GridViewAdapter } from '../view.adapter';
import { GridCard } from '../../card/card.component';

@Component({
  selector: 'app-grid-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  standalone: true,
  imports: [GridCard],
})
export class GridGallery extends GridViewAdapter {}
