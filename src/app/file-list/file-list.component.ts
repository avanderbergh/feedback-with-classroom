import { Component, OnInit } from '@angular/core';
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
  studnetId: string;
  private sub: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private googleApi: GoogleApiService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    const coursePromise = new Promise<any> ((resolve, reject) => {
      this.route.parent.params.subscribe(params => {
        this.courseId = params['id'];
        if (!this.dataService.selectedCourse) {
          const url = `https://classroom.googleapis.com/v1/courses/${this.courseId}`;
          this.googleApi.get(url).then(
            result => {
              this.dataService.selectedCourse = result;
              resolve(result); }
          );
        } else {
          resolve(this.dataService.selectedCourse);
        }
      });
    });
    const studentPromise = new Promise<any> ((resolve, reject) => {
      this.sub = this.route.params.subscribe(params => {
        this.studnetId = params['id'];
        if (!this.dataService.selectedStudent) {
          const url = `https://classroom.googleapis.com/v1/courses/${this.courseId}/students/${this.studnetId}`;
          this.googleApi.get(url).then(
            result => {
              this.dataService.selectedStudent = result;
              resolve(result);
            }
          );
        } else {
          resolve(this.dataService.selectedStudent);
        }
      });
    });
    Promise.all([studentPromise, coursePromise]).then(() => {
      const teacherGroupEmail = this.dataService.selectedCourse.teacherGroupEmail;
      const emailAddress = this.dataService.selectedStudent.profile.emailAddress;
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
                let newFile:any = { };
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
          // this.files = files;
        },
        err => console.log(err)
      );
    });
  }

}
