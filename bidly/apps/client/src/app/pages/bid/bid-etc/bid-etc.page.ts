/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BidEtcDto } from '@api-client';
import { Icon } from '@client-libs';
import FileDownloadComponent from '../../../components/file-download/file-download.component';
import { BookmarkIconComponent } from '../../../components/bookmark-icon/bookmark-icon.component';
import BidDetailPage from '../bid-detail/bid-detail.page';

@Component({
  selector: 'app-bid-etc',
  imports: [CommonModule, FileDownloadComponent, Icon, BookmarkIconComponent],
  templateUrl: './bid-etc.page.html',
  styleUrl: './bid-etc.page.css',
})
export default class BidEtcPage extends BidDetailPage {
  readonly location = inject(Location);
  bidEtc = computed(() => this.$bid.value() as BidEtcDto);
}
