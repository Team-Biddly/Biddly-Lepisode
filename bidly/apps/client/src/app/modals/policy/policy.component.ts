import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy.component.html',
})
export class PolicyComponent {
  safeContent: SafeHtml | null = null;

  protected data = inject(DIALOG_DATA);
  private sanitizer = inject(DomSanitizer);
  private dialogRef = inject(DialogRef<PolicyComponent>);

  constructor() {
    if (this.data?.content) {
      this.safeContent = this.sanitizer.bypassSecurityTrustHtml(
        this.data.content,
      );
    }
  }

  close() {
    this.dialogRef.close();
  }
}
