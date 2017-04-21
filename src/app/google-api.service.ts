/// <reference types="gapi" />
/// <reference types="gapi.auth2" />
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';

@Injectable()
export class GoogleApiService {

  public client_id = '279180053002-8f0275sgal1ebfh27v6sp01nql52lf86.apps.googleusercontent.com';
  public api_key = 'AIzaSyC3FfmyAI4BkxSj6Ow7KkJZ_OxwhAuAo40';
  public scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
    'https://www.googleapis.com/auth/classroom.profile.emails',
    'https://www.googleapis.com/auth/classroom.profile.photos',
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
    'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly'
  ].join(' ');
  constructor(private af: AngularFire, private router: Router) { }
  public signIn() {
    gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.client_id,
          scope: this.scope
        }).then(() => {
          gapi.signin2.render('my-signin2', {
            'scope': this.scope,
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'light',
            'onsuccess': param => this.onSignIn(param)
          });
        });
      });
  }
  public onSignIn(googleUser) {
      setTimeout(this.router.navigate(['h']), 1000);
  }
  public isSignedIn(): Promise<boolean> {
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.client_id,
          scope: this.scope
        }).then(() => {
          // Check if the user is signed in with the gapi.
          if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            // If the user is signed in with gapi, also sign them in with firebase auth.
            this.af.auth.subscribe(authObject => {
              if (!authObject) {this.af.auth.login(); }
            });
            resolve(true);
          } else {
            this.router.navigate(['/login']);
            resolve(false);
          }
        });
      });
    });
  }
  public getFiles() {
    let files = [];
    const p = new Promise<any> ((resolve, reject) => {
      gapi.load('auth2:client', () => {
        gapi.client.request({
          path: 'https://www.googleapis.com/drive/v3/files',
        }).then(response => {
          resolve(response.result.files);
        }, reason => {
          console.log(reason.result);
          reject(reason.result);
        });
      });
    });
    p.then(result => {
       for (let file of result) {
         files.push(file);
       }
    });
    return files;
  }
  public listCourses() {
    let courses = [];
    const p = new Promise<any> ((resolve, reject) => {
      gapi.load('auth2:client', () => {
        gapi.client.request({
          path: 'https://classroom.googleapis.com/v1/courses',
          params: {
            teacherId: 'me'
          }
        }).then(response => {
          resolve(response.result.courses);
        }, reason => {
          console.log(reason.result);
          reject(reason.result);
        });
      });
    });
    p.then(result => {
      for (let course of result) {
        courses.push(course);
      }
    });
    return courses;
  }
  public listStudents(courseId) {
    let students = [];
    const p = new Promise<any> ((resolve, reject) => {
      gapi.load('auth2:client', () => {
        gapi.client.request({
          path: 'https://classroom.googleapis.com/v1/courses/' + courseId + '/students',
        }).then(response => {
          resolve(response.result.students);
        }, reason => {
          console.log(reason.result);
          reject(reason.result);
        });
      });
    });
    p.then(result => {
      for (let student of result) {
        students.push(student);
      }
    });
    return students;
  }
}
