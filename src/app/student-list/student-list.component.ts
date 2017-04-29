import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GoogleApiService } from '../google-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students;
  dataString;
  private sub: any;
  private selectedId: number;
  constructor(
    private googleApi: GoogleApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
    console.log(this.dataService.selectedCourse);
    this.sub = this.route.params.subscribe(params => {
      const url = `https://classroom.googleapis.com/v1/courses/${params['id']}/students`;
      const obj = 'students';
      this.googleApi.apiResult(url, obj).then(
        result => this.students = result,
        err => console.log(err)
      );
    });
  }
}
