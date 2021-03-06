import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { MdCardModule,
  MdToolbarModule,
  MdGridListModule,
  MdListModule,
  MdTooltipModule,
  MdButtonModule,
  MdProgressSpinnerModule,
  MdChipsModule,
  MdSelectModule } from '@angular/material';

import { GoogleApiService } from './google-api.service';
import { AuthGuard } from './auth-guard.service';
import { CourseListComponent } from './course-list/course-list.component';
import { StudentListComponent } from './student-list/student-list.component';
import { FileListComponent } from './file-list/file-list.component';
import 'hammerjs';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FileListComponent,
    CourseListComponent,
    StudentListComponent
  ],
  imports: [
    HttpModule,
    JsonpModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    MdCardModule,
    MdToolbarModule,
    MdGridListModule,
    MdListModule,
    MdTooltipModule,
    MdButtonModule,
    MdProgressSpinnerModule,
    MdChipsModule,
    MdSelectModule
  ],
  providers: [GoogleApiService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
