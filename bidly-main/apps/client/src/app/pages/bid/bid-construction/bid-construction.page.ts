import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Icon, Segment, SegmentOption } from '@client-libs';
import { BidConstructionTabs, fnGetKeyByValue } from '@common';
import FileDownloadComponent from '../../../components/file-download/file-download.component';
import BidDetailPage from '../bid-detail/bid-detail.page';
import { BookmarkIconComponent } from '../../../components/bookmark-icon/bookmark-icon.component';

@Component({
  selector: 'app-bid-construction',
  imports: [
    CommonModule,
    Icon,
    Segment,
    FileDownloadComponent,
    BookmarkIconComponent,
  ],
  templateUrl: './bid-construction.page.html',
  styleUrl: './bid-construction.page.css',
})
export default class BidConstructionPage extends BidDetailPage {
  readonly location = inject(Location);

  segmentOptions: SegmentOption[] = Object.entries(BidConstructionTabs).map(
    ([key, value]) => ({
      label: key,
      value: value,
    }),
  );
  BidConstructionTabs = BidConstructionTabs;
  fnGetKeyByValue = fnGetKeyByValue;

  isBookMarked = signal(false);
  segment = signal<keyof typeof BidConstructionTabs>(
    BidConstructionTabs['투찰제한-일반'],
  );
}
