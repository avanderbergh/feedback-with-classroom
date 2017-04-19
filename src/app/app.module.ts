import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { GoogleApiService } from './google-api.service';
import { AuthGuard } from './auth-guard.service';
import { FilesComponent } from './files/files.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FilesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [GoogleApiService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
