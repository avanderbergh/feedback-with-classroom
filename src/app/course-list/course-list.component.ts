import { Component, OnInit } from '@angular/core';
import { GoogleApiService } from '../google-api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  courses;
  constructor(
    private googleApi: GoogleApiService,
    private dataService: DataService,
    private router: Router
    ) { }

  ngOnInit() {
    const url = 'https://classroom.googleapis.com/v1/courses';
    const obj = 'courses';
    const params = {teacherId: 'me'};
    this.googleApi.apiResult(url, obj, params).then(
      result => this.courses = result,
      err => console.log(err)
    );
  }

  onSelect (course: any) {
    this.dataService.selectedCourse = course;
    this.router.navigate(['c/', course.id]);
  }
}
