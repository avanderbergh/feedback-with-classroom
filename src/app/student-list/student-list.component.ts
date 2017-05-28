import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GoogleApiService } from '../google-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  courseWork: any[] = [];
  loading = false;
  selectedStudent: any = {};
  private sub: any;
  private selectedId: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private googleApi: GoogleApiService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const coursePromise = new Promise<any> ((resolve, reject) => {
        if (!this.dataService.selectedCourse) {
          const url = `https://classroom.googleapis.com/v1/courses/${params['id']}`;
          this.googleApi.get(url).then(
            result => {
              this.dataService.selectedCourse = result;
              resolve(result);
            }, reason => {
              reject(reason);
            }
          );
        } else {
          resolve(this.dataService.selectedCourse);
        };
      });
      coursePromise.then(() => {
        this.loading = true;
        let url = `https://classroom.googleapis.com/v1/courses/${params['id']}/courseWork`;
        let obj = 'courseWork';
        let p = {
          courseWorkStates: 'PUBLISHED',
          fields: 'courseWork(description,id,title,workType,alternateLink),nextPageToken'
        };
        this.googleApi.list(url, obj, p).then(
          result => {
            this.dataService.courseWork = result;
          },
          err => {
            console.log(err);
          }
        );

        url = `https://classroom.googleapis.com/v1/courses/${params['id']}/students`;
        obj = 'students';
        this.googleApi.list(url, obj).then(
          result => {
            this.loading = false;
            this.students = result;
          },
          err => {
            console.log(err);
            this.loading = false;
          }
        );
      });
    });
  }
  onSelect(student: any) {
    this.dataService.selectStudent(student);
    this.router.navigate(['s', student.userId, 'files'], {relativeTo: this.route});
  }
}
