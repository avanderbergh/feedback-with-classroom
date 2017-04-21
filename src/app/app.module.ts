import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { GoogleApiService } from './google-api.service';
import { AuthGuard } from './auth-guard.service';
import { FilesComponent } from './files/files.component';
import { CourseListComponent } from './course-list/course-list.component';
import { StudentListComponent } from './student-list/student-list.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyC3FfmyAI4BkxSj6Ow7KkJZ_OxwhAuAo40',
  authDomain: 'brilliant-badger.firebaseapp.com',
  databaseURL: 'https://brilliant-badger.firebaseio.com',
  storageBucket: 'brilliant-badger.appspot.com',
  messagingSenderId: '279180053002'
};

export const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FilesComponent,
    CourseListComponent,
    StudentListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  providers: [GoogleApiService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
