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
  files;
  dataString;
  subsciption: Subscription;
  private sub: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private googleApi: GoogleApiService,
    private dataService: DataService
  ) {
    this.subsciption = dataService.dataString$.subscribe(
      dataString => {
        this.dataString = dataString;
      }
    );
  }

  ngOnInit() {
    console.log('dataString: ', this.dataString);
    console.log('foo: ', this.dataService.foo);
    this.sub = this.route.params.subscribe(params => {
      const url = 'https://www.googleapis.com/drive/v3/files';
      const obj = 'items';
      const p = {
        q: ''
      };
    });
  }

}
