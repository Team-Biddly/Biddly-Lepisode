/* eslint-disable @angular-eslint/prefer-inject */
import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-admin-action-modal',
  template: `
    <div class="absolute top-0 right-0 p-4">
      <h2>관리자 액션</h2>
      <button (click)="edit()">수정</button>
      <button (click)="delete()">삭제</button>
      <button (click)="block()">차단</button>
    </div>
  `,
})
export class AdminActionModalComponent {
  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: any,
  ) {}

  edit() {
    this.data.onEdit();
    this.dialogRef.close();
  }
  delete() {
    this.data.onDelete();
    this.dialogRef.close();
  }
  block() {
    this.data.onBlock();
    this.dialogRef.close();
  }
}
