import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrackingService } from '@client-libs';
import { environment } from '../environments/environment';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly trackingService = inject(TrackingService);
  private baseUrl = environment.baseUrl

  constructor() {
    this.trackingService.trackVisitor(this.baseUrl);
  }
}
