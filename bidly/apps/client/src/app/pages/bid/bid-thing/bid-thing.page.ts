import { Component, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import BidDetailPage from '../bid-detail/bid-detail.page';
import { Icon } from '@client-libs';
import { BidThingDto } from '@api-client';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
  selector: 'app-bid-thing',
  imports: [CommonModule, Icon, CdkAccordionModule],
  templateUrl: './bid-thing.page.html',
  styleUrl: './bid-thing.page.css',
})
export default class BidThingPage extends BidDetailPage {
  protected readonly location = inject(Location);

  bidThing = computed(() => this.$bid.value() as BidThingDto);
}
