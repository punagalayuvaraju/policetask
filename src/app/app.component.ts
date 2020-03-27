import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { FrontEndConfig } from './frontendConfig';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testproject';
  serverurl:any;
  constructor(private router:Router ,private frontendconfig:FrontEndConfig) {
  this.serverurl = this.frontendconfig.getfrontendurl();
  const storage = localStorage.getItem('currentUser');
  if (storage) {
    const loc = window.location.href.replace(this.serverurl, '');
    console.log(loc);
    if (loc === '/') {
      this.router.navigate(['home']);
    } else {
      this.router.navigateByUrl(loc);
    }
  } else {
    this.router.navigate(['/']);
  }
  }


}
