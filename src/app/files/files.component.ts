import { Component, AfterViewInit } from '@angular/core';
import { GoogleApiService } from '../google-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements AfterViewInit {

  constructor(private googleApi: GoogleApiService) { }

  ngAfterViewInit() {
    this.googleApi.getFiles();
  }

}
