import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CourseListComponent } from './course-list/course-list.component';
import { StudentListComponent } from './student-list/student-list.component';
import { FileListComponent } from './file-list/file-list.component';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/h',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'h',
    component: CourseListComponent ,
    canActivate: [AuthGuard]
  },
  {
    path: 'c/:id',
    component: StudentListComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id/files',
        component: FileListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
