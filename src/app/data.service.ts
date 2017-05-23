import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  selectedCourse;
  courseWork;
  private selectedStudent = new BehaviorSubject<any>({});

  studentSelected$ = this.selectedStudent.asObservable();

  selectStudent(student: any) {
    this.selectedStudent.next(student);
  }
}
