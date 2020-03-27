import { BrowserModule } from '@angular/platform-browser';
import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import {HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http'
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import {UserService} from './_services/user.service';
import {Routes, RouterModule} from '@angular/router'
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FrontEndConfig } from './frontendConfig';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatDialogModule} from '@angular/material/dialog'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input' ;
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { HomeComponent } from './home/home.component';
import { AuditComponent } from './audit/audit.component';
import { LoginComponent } from './login/login.component';
import {FilterPipe} from './filter.pipe'

const routes : Routes = [
  {path:'',component :LoginComponent},
  {path:'home',component :HomeComponent},
  {path:'audit',component:AuditComponent},
  {path:'signup',component:SignupComponent}

]


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HomeComponent,
    AuditComponent,
    LoginComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    NgxSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right'
    }),
  ],
  exports:[
    RouterModule
  ],
  providers: [
    UserService, FrontEndConfig,  ],

    entryComponents: [
      HomeComponent,
    ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
