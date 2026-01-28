import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  bidThing = computed(() => this.$bid.value() as BidThingDto);
}
