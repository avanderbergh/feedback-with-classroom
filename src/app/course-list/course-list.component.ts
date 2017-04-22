import { Component, OnInit } from '@angular/core';
import { GoogleApiService } from '../google-api.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  courses;
  constructor(private googleApi: GoogleApiService) { }

  ngOnInit() {
    let url = 'https://classroom.googleapis.com/v1/courses';
    let obj = 'courses';
    let params = {teacherId: 'me'};
    this.googleApi.apiResult(url, obj, params).then(
      result => this.courses = result,
      err => console.log(err)
    );
  }
}
