import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GoogleApiService } from '../google-api.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  files: any[] = [];
  courseId: string;
  studnetId: number;
  private courseParamSub: any;
  private studentParamSub: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private googleApi: GoogleApiService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.studentSelected$.subscribe(student => {
      console.log(student);
      const coursePromise = new Promise<any> ((resolve, reject) => {
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
      this.files = [];
      Promise.all([studentPromise, coursePromise]).then(result => {
        const selectedStudent = result[0];
        const teacherGroupEmail = this.dataService.selectedCourse.teacherGroupEmail;
        const emailAddress = selectedStudent.profile.emailAddress;
        const url = 'https://www.googleapis.com/drive/v3/files';
        const obj = 'files';
        const p = {
          q: `'${teacherGroupEmail}' in writers
              and (
                '${emailAddress}' in readers or
                '${emailAddress}' in owners
              )`,
          fields: 'files(iconLink,id,name,thumbnailLink,webViewLink),nextPageToken'
        };
        this.googleApi.list(url, obj, p).then(
          files => {
            for (const file of files) {
              const url = `https://www.googleapis.com/drive/v3/files/${file.id}/comments`;
              const obj = 'comments';
              const p = { fields: '*' };
              this.googleApi.list(url, obj, p).then(
                comments => {
                  const newFile: any = { };
                  newFile.id = file.id;
                  newFile.name = file.name;
                  newFile.webViewLink = file.webViewLink;
                  newFile.iconLink = file.iconLink;
                  newFile.thumbnailLink = file.thumbnailLink;
                  newFile.comments = comments;
                  this.files.push(newFile);
                }
              );
            }
          },
          err => console.log(err)
        );
      });
    });
  }
}
