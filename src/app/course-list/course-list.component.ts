import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GoogleApiService } from '../google-api.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements AfterViewInit {

  courses;
  loading = false;
  constructor(
    private router: Router,
    private dataService: DataService,
    private googleApi: GoogleApiService
    ) { }

  ngAfterViewInit() {
    const url = 'https://classroom.googleapis.com/v1/courses';
    const obj = 'courses';
    const params = {teacherId: 'me'};
    this.loading = true;
    this.googleApi.list(url, obj, params).then(
      result => {
        this.loading = false;
        this.courses = result;
      },
      err => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  onSelect (course: any) {
    this.dataService.selectedCourse = course;
    this.router.navigate(['c', course.id]);
  }
}
