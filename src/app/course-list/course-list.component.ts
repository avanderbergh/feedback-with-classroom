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
    this.courses = this.googleApi.listCourses();
  }

}
