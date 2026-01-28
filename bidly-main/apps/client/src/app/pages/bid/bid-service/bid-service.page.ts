import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Icon } from '@client-libs';
import FileDownloadComponent from '../../../components/file-download/file-download.component';
import BidDetailPage from '../bid-detail/bid-detail.page';
import { BookmarkIconComponent } from '../../../components/bookmark-icon/bookmark-icon.component';

@Component({
  selector: 'app-bid-service',
  imports: [CommonModule, FileDownloadComponent, Icon, BookmarkIconComponent],
  templateUrl: './bid-service.page.html',
  styleUrl: './bid-service.page.css',
})
export default class BidServicePage extends BidDetailPage {
  readonly location = inject(Location);

  isBookMarked = signal(false);
}
