import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DataService {

  foo;
  selectedCourse;

  private dataStringSource = new Subject<string>();

  dataString$ = this.dataStringSource.asObservable();

  changeData(newData: string) {
    this.dataStringSource.next(newData);
  }
}
