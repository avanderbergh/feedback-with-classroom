import { Component, AfterViewInit } from '@angular/core';
import { GoogleApiService } from './google-api.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ DataService ]
})
export class AppComponent implements AfterViewInit {
  constructor(
    private googleApi: GoogleApiService
    ) { }
  ngAfterViewInit() {}
}
