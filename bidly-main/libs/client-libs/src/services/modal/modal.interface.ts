export interface ModalConfig<T = any> {
  componentProps?: T;
  hasBackdrop?: boolean;
  disableClose?: boolean;
  providers?: any[];
}
export interface IModal {
  create(args: any): any;
  close(args: any): any;
}
