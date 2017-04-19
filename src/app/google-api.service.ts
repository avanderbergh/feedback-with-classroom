/// <reference types="gapi" />
/// <reference types="gapi.auth2" />
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare var gapi: any;

@Injectable()
export class GoogleApiService {

  public client_id = '223687072677-79vuse35to6nms5d2ahp5l4q0bjnerk2.apps.googleusercontent.com';
  public scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/drive'
  ].join(' ');
  constructor(private router: Router) { }
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
          'onsuccess': param => this.router.navigate(['h'])
        });
      });
    });
  }
  public isSignedIn(): Promise<boolean> {
    return new Promise( resolve => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.client_id,
          scope: this.scope
        }).then(() => {
          if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            console.log('signed in!!');
            resolve(true);
          } else {
            console.log('not signed in!!');
            this.router.navigate(['/login']);
            resolve(false);
          }
        });
      });
    });
  }
  public getFiles() {
    gapi.load('auth2:client', () => {
      if (!gapi.auth2.getAuthInstance()) {
        this.router.navigate(['login']);
      } else {
        gapi.client.request({
        'path': 'https://www.googleapis.com/drive/v3/files',
      }).then(function(response) {
        return response.result;
      }, function(reason){
        return reason.result;
      });
      }
    });
  }
}
