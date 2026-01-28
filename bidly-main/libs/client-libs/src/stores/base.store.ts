import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

export class BaseStore<T = any> {
  protected readonly state$ = new Subject<T>();
  protected readonly state = toSignal(this.state$);

  constructor(initialState: T) {
    this.state$.next(initialState);
  }

  protected updateState(partialState: Partial<T>) {
    this.state$.next({
      ...this.state()!,
      ...partialState,
    });
  }

  protected get(): T {
    return {
      ...this.state()!,
    };
  }
}
