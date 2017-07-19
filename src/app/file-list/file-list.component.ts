import { Component, OnInit, AfterViewInit , OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GoogleApiService } from '../google-api.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})


export class FileListComponent implements OnInit, OnDestroy {

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  courseWork: any[] = [];
  files: any[] = [];
  loading = false;
  courseId: string;
  studentId: number;
  myComments: string;
  nounVerbPairs: string[];
  private selectedStudentSub: any;
  private courseParamSub: any;
  private studentParamSub: any;
  private courseWorkParamSub: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private googleApi: GoogleApiService,
    private dataService: DataService,
    private http: Http
  ) { }

  ngOnInit() {
    this.selectedStudentSub = this.dataService.studentSelected$.subscribe(async student => {
      this.myComments = '';
      this.courseWork = student.courseWork;
      const courseWorkPromise = new Promise<any> ((resolve, reject) => {
        this.courseWorkParamSub = this.route.parent.params.subscribe(params => {
          this.courseId = params['id'];
          if (!this.courseWork) {
            let url = `https://classroom.googleapis.com/v1/courses/${params['id']}/courseWork`;
            let obj = 'courseWork';
            let p = {
              courseWorkStates: 'PUBLISHED',
              fields: 'courseWork(description,id,title,workType,alternateLink),nextPageToken'
            };
            this.googleApi.list(url, obj, p).then(
              result => {
                console.log('Setting Course Work');
                this.courseWork = result;
                resolve(result);
              },
              err => {
                console.log(err);
                reject(err);
              }
            );
          } else {
            resolve(this.courseWork);
          }
        });
        this.courseWorkParamSub.complete();
      });
      const coursePromise = new Promise<any> ((resolve, reject) => {
        this.courseParamSub = this.route.parent.params.subscribe(params => {
          this.courseId = params['id'];
          if (!this.dataService.selectedCourse) {
            let url = `https://classroom.googleapis.com/v1/courses/${this.courseId}`;
            this.googleApi.get(url).then(
              result => {
                this.dataService.selectedCourse = result;
                this.courseId = result.id;
                resolve(result); }
            );
          } else {
            this.courseId = this.dataService.selectedCourse.id;
            resolve(this.dataService.selectedCourse);
          }
        });
        this.courseParamSub.complete();
      });
      const studentPromise = new Promise<any> ((resolve, reject) => {
        this.studentParamSub = this.route.params.subscribe(params => {
          this.studentId = params['id'];
          if (!student.hasOwnProperty('userId')) {
            const url = `https://classroom.googleapis.com/v1/courses/${this.courseId}/students/${this.studentId}`;
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
      await Promise.all([studentPromise, coursePromise, courseWorkPromise]).then(async result => {
        this.loading = true;
        this.studentId = result[0].userId;
        if (this.courseWork) {
          for (const courseWork of this.courseWork) {
            let url = `https://classroom.googleapis.com/v1/courses/${this.courseId}/courseWork/${courseWork.id}/studentSubmissions`;
            let obj = 'studentSubmissions';
            let p = {
              fields: '*',
              userId: this.studentId
            };
            await this.googleApi.list(url, obj, p).then(
              async submissions => {
                courseWork.submissions = submissions;
                for (const submission of courseWork.submissions) {
                  if (submission.assignmentSubmission) {
                    if (submission.assignmentSubmission.attachments) {
                      for (const attachment of submission.assignmentSubmission.attachments) {
                        if (attachment.driveFile) {
                          let url = `https://www.googleapis.com/drive/v3/files/${attachment.driveFile.id}/comments`;
                          let obj = 'comments';
                          let p = { fields: '*' };
                          await this.googleApi.list(url, obj, p).then(
                            comments => {
                              if (comments.length > 0 ) {
                                courseWork.show = true;
                              } else {
                                courseWork.show = false;
                              }
                              attachment.driveFile.comments = comments;
                              for (const comment of comments) {
                                if (comment.author.me) {
                                  this.myComments = this.myComments.concat(comment.content, ' ');
                                }
                                for (const reply of comment.replies) {
                                  if (reply.author.me) {
                                    this.myComments = this.myComments.concat(reply.content);
                                  }
                                }
                              }
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
        console.log('1: ', this.myComments);
        let url = 'https://us-central1-brilliant-badger.cloudfunctions.net/analyzeSyntax';
        let body = { 'text': this.myComments };
        let myResult = this.http.post(url, JSON.stringify(body))
                              .map(res => {
                                let body = res.json();
                                return body;
                              }).catch(this.handleError);
        myResult.subscribe(syntax => {
          console.log(syntax);
          this.nounVerbPairs = syntax;
        });
      });
    });
  }
  ngOnDestroy() {
    this.selectedStudentSub.complete();
  }
}
