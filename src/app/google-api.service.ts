/// <reference types="gapi" />
/// <reference types="gapi.auth2" />
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class GoogleApiService {

  user: Observable<firebase.User>;
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
  constructor(
    private router: Router,
    public afAuth: AngularFireAuth
  ) { this.user = afAuth.authState; }
  public signIn() {
    gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.client_id,
          scope: this.scope
        }).then(() => {
          gapi.signin2.render('my-signin2', {
            'scope': this.scope,
            'width': 560,
            'height': 50,
            'longtitle': true,
            'theme': 'light',
            'onsuccess': param => this.onSignIn(param)
          });
        });
      });
  }
  public onSignIn(googleUser) {
    window.setTimeout(() => this.router.navigate(['h']), 1000);
  }
  public isSignedIn(): Promise<boolean> {
    console.log('isSignedIn Called');
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.client_id,
          scope: this.scope
        }).then(() => {
          // Check if the user is signed in with the gapi.
          if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            this.user.subscribe(user => {
              // If the user is signed in with gapi, also sign them in with firebase auth.
              if (!user) {
                this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
              }
              resolve(true);
            });
          } else {
            this.router.navigate(['/login']);
            resolve(false);
          }
        });
      });
    });
  }

  public async list (path: string, objectName: string, params: any = { }) {
    const requestPage = async (tries: number) => new Promise<any> ((resolve, reject) => {
      gapi.load('auth2:client', () => {
        gapi.client.request({
          path: path,
          params: params
        }).then(response => {
          // resolve this promise with the first key in the response object.
          resolve(response.result);
        }, reason => {
          console.log('failed, reason: ', reason.status);
          if (reason.status === 404) {
            resolve([]);
          } else if (reason.status === 403) {
            let waitTime = Math.round(Math.pow(2, tries) * 1000 + (Math.random() * 1000 ));
            console.log('Try: ', tries, 'Wait time: ', waitTime);
            setTimeout(() => resolve(false), waitTime);
          } else {
            resolve(false);
          }
        });
      });
    });

    let returnArray: any[] = [];
    let err;
    let tries = 0;
    do {
      console.log('Starting...');
      let page: any = {};
      err = false;
      page = await requestPage(tries);
      if (page) {
        if (page.hasOwnProperty(objectName)) {
          for (let obj of page[objectName]) {
            returnArray.push(obj);
          }
        }
        if (page.hasOwnProperty('nextPageToken')) {
          params.pageToken = page.nextPageToken;
        } else {
          params.pageToken = null;
        }
      } else {
        err = true;
        tries++;
        params.pageToken = null;
      }
    } while (params.pageToken || err);
    return returnArray;
  }

  public async get (path: string, params: any = {}) {
    const requestPage = async () => new Promise<any> ((resolve, reject) => {
      gapi.load('auth2:client', () => {
        gapi.client.request({
          path: path,
          params: params
        }).then(response => {
          // resolve this promise with the first key in the response object.
          resolve(response.result);
        }, reason => {
          console.log(reason);
          reject(reason.result);
        });
      });
    });
    return await requestPage();
  }

  public async batchApiResult(fileIds: string[]) {
    console.log('batch API call: ', fileIds);
    const requestPage = async () => new Promise<any> ((resolve, reject) => {
      console.log('In Promise');
      gapi.load('auth2:client', () => {
        console.log('Gapi Loaded!', fileIds);
        let batch =  new gapi.client.HttpBatch();
        console.log(batch);
        for (let fileId of fileIds) {
          console.log('FileID: ', fileId);
          let r = gapi.client.request({
            path: `https://www.googleapis.com/drive/v3/files/${fileId}/comments`
          });
          batch.add(r);
        }
        console.log('executing batch: ', batch);
        batch.execute(respose => resolve(respose));
      });
    });
    return await requestPage();
  }
}
