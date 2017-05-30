import { Component, OnInit, AfterViewInit , OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GoogleApiService } from '../google-api.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit, OnDestroy {
  courseWork: any[] = [];
  files: any[] = [];
  loading = false;
  courseId: string;
  studnetId: number;
  private selectedStudentSub: any;
  private courseParamSub: any;
  private studentParamSub: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private googleApi: GoogleApiService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    console.log('Loading File List Component');
    this.selectedStudentSub = this.dataService.studentSelected$.subscribe(student => {
      this.courseWork = student.courseWork;
      console.log('student: ', student);
      const coursePromise = new Promise<any> ((resolve, reject) => {
        console.log('file-list-coursePromise called');
        this.courseParamSub = this.route.parent.params.subscribe(params => {
          this.courseId = params['id'];
          if (!this.dataService.selectedCourse) {
            const url = `https://classroom.googleapis.com/v1/courses/${this.courseId}`;
            this.googleApi.get(url).then(
              result => {
                console.log('getting course info...');
                this.dataService.selectedCourse = result;
                resolve(result); }
            );
          } else {
            resolve(this.dataService.selectedCourse);
          }
        });
        this.courseParamSub.complete();
      });
      const studentPromise = new Promise<any> ((resolve, reject) => {
        console.log('file-list-studentPromise called');
        this.studentParamSub = this.route.params.subscribe(params => {
          this.studnetId = params['id'];
          if (!student.hasOwnProperty('userId')) {
            const url = `https://classroom.googleapis.com/v1/courses/${this.courseId}/students/${this.studnetId}`;
            this.googleApi.get(url).then(
              result => {
                resolve(result);
              }
            );
          } else {
            resolve(student);
          }
        });
        this.studentParamSub.complete();
      });
      Promise.all([studentPromise, coursePromise]).then(result => {
        this.loading = true;
        if (student.courseWork) {
          for (const courseWork of student.courseWork) {
            let url = `https://classroom.googleapis.com/v1/courses/${student.courseId}/courseWork/${courseWork.id}/studentSubmissions`;
            let obj = 'studentSubmissions';
            let p = {
              fields: '*',
              userId: student.userId
            };
            this.googleApi.list(url, obj, p).then(
              submissions => {
                courseWork.submissions = submissions;
                for (const submission of courseWork.submissions) {
                  if (submission.assignmentSubmission) {
                    if (submission.assignmentSubmission.attachments) {
                      for (const attachment of submission.assignmentSubmission.attachments) {
                        if (attachment.driveFile) {
                          let url = `https://www.googleapis.com/drive/v3/files/${attachment.driveFile.id}/comments`;
                          let obj = 'comments';
                          let p = { fields: '*' };
                          this.googleApi.list(url, obj, p).then(
                            comments => {
                              attachment.driveFile.comments = comments;
                            }
                          );
                        }
                      }
                    }
                  }
                }
              }
            );
          }
        }
        this.loading = false;
      });
    });
  }
  ngOnDestroy() {
    this.selectedStudentSub.complete();
  }
}
