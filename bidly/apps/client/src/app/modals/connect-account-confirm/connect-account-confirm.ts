import { Component } from '@angular/core';
import { MODAL_CONFIRM, ModalBasement } from '@client-libs';
import { Button, ButtonType } from '../../components/button/button';

@Component({
  selector: 'app-connect-account-confirm',
  templateUrl: './connect-account-confirm.html',
  imports: [Button],
})
export class ConnectAccountConfirm extends ModalBasement {
  buttonType = ButtonType;
  MODAL_CONFIRM = MODAL_CONFIRM;

  constructor() {
    super();
  }
}
