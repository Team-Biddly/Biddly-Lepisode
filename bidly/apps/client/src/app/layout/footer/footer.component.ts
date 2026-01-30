import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BusinessInfoService, PolicyService } from '@api-client';
import { ModalService } from '@client-libs';
import { PolicyComponent } from '../../modals/policy/policy.component';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly modalService = inject(ModalService);
  private readonly policyService = inject(PolicyService);
  private readonly businessInfoService = inject(BusinessInfoService);

  businessInfo$ = rxResource({
    stream: () =>
      this.businessInfoService.businessInfoControllerGetBusinessInfo(),
  });

  businessInfo = this.businessInfo$.value;

  openTerms() {
    this.policyService
      .policyControllerFindByTitle({ title: '이용약관' })
      .subscribe({
        next: (res) => {
          this.modalService.create(PolicyComponent, {
            componentProps: {
              title: res.title,
              content: res.content,
            },
          });
        },
        error: (err) => {
          console.error('Error fetching terms:', err);
        },
      });
  }

  openPrivacyPolicy() {
    this.policyService
      .policyControllerFindByTitle({ title: '개인정보처리방침' })
      .subscribe({
        next: (res) => {
          this.modalService.create(PolicyComponent, {
            componentProps: {
              title: res.title,
              content: res.content,
            },
          });
        },
        error: (err) => {
          console.error('Error fetching terms:', err);
        },
      });
  }
}
