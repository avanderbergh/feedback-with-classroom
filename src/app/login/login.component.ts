/// <reference types="gapi" />
/// <reference types="gapi.auth2" />
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from '../google-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  constructor(private gooleApi: GoogleApiService, public router: Router) { }

  ngAfterViewInit() {
    this.gooleApi.signIn();
  }

}
