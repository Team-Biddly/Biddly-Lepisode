import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AlertService } from '@client-libs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  standalone: true,
  imports: [CommonModule],
})
export default class AlertPage {
  readonly alertService = inject(AlertService);

  open(type: 'success' | 'info' | 'warning' | 'error') {
    this.alertService.open({
      type,
      title: 'Title',
      content: 'Content',
      buttons: {
        confirm: {
          text: 'Confirm',
        },
        cancel: {
          text: 'Cancel',
        },
      },
      checkbox: {
        text: 'Checkbox',
      },
      data: [
        {
          value: 'value1',
          key: 'key1',
        },
        {
          value: 'value2',
          key: 'key2',
        },
      ],
      inputs: [
        {
          key: 'key',
          type: 'text',
          label: 'Label',
        },
        {
          key: 'key2',
          type: 'number',
          label: 'Label2',
          required: true,
        },
        {
          type: 'textarea',
          key: 'key3',
          label: 'Label3',
        },
      ],
    });
  }
}
