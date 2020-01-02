import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaderService {
  public status: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  display(value: number) {
    this.status.next(value);
  }
}
