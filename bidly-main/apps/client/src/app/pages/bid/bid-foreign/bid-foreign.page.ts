import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { BidForeignDto } from '@api-client';
import BidDetailPage from '../bid-detail/bid-detail.page';
import { Icon } from '@client-libs';

@Component({
  selector: 'app-bid-foreign',
  imports: [CommonModule, CdkAccordionModule, Icon],
  templateUrl: './bid-foreign.page.html',
  styleUrl: './bid-foreign.page.css',
})
export default class BidForeignPage extends BidDetailPage {

  bidThing = computed(() => this.$bid.value() as BidForeignDto);
}
