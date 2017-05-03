import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { MdCardModule, MdToolbarModule, MdGridListModule, MdListModule } from '@angular/material';

import { GoogleApiService } from './google-api.service';
import { AuthGuard } from './auth-guard.service';
import { CourseListComponent } from './course-list/course-list.component';
import { StudentListComponent } from './student-list/student-list.component';
import { FileListComponent } from './file-list/file-list.component';
import 'hammerjs';

export const firebaseConfig = {
  apiKey: 'AIzaSyC3FfmyAI4BkxSj6Ow7KkJZ_OxwhAuAo40',
  authDomain: 'brilliant-badger.firebaseapp.com',
  databaseURL: 'https://brilliant-badger.firebaseio.com',
  storageBucket: 'brilliant-badger.appspot.com',
  messagingSenderId: '279180053002'
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CourseListComponent,
    StudentListComponent,
    FileListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    MdCardModule, MdToolbarModule, MdGridListModule, MdListModule
  ],
  providers: [GoogleApiService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
