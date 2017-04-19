import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { GoogleApiService } from './google-api.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private googleApi: GoogleApiService) { }
  canActivate() {
    return this.googleApi.isSignedIn();
  }

}
