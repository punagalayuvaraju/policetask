import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FilterPipe } from '../filter.pipe';
import { MatDialog } from '@angular/material';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css'],
  providers: [FilterPipe]
})
export class AuditComponent implements OnInit {
  userinfo:any;
  allusers:any;
  start = 0;
  end = 5;
  constructor(private dialog: MatDialog,public userservc:UserService,private spinner:NgxSpinnerService,private router:Router) { }

  ngOnInit() {
    this.userinfo = null;
    this.userinfo = JSON.parse(localStorage.getItem('currentUser'));
    this.startup(this.userinfo)
  }

  startup(user) {
    this.spinner.show();
    // const obj = {
    //   start: this.start,
    //   end: this.end,
    // };
    this.userservc.getallcomplaints(user.username).subscribe((data: any) => {
      this.allusers = [];
      this.allusers=data;
      this.spinner.hide();
      console.log(this.allusers);
    },err => {
      this.spinner.hide();
    })
  }

  _handleKeydown(event) {
    // tslint:disable-next-line: deprecation
    if (event.keyCode === 32) {
      // do not propagate spaces to MatSelect, as this would select the currently active option
      event.stopPropagation();
    }
    if (event.which === 32 && event.target.selectionStart === 0) {
      return false;
    }

  }


  // next10Records() {
  //   if (this.start >= 0 && this.end >= 0) {
  //     this.spinner.show();
  //     this.start = this.end;
  //     this.end = this.end + 5;
  //     const obj = {
  //       start: this.start,
  //       end: this.end,
  //     };
  //     this.userservc.getallcomplaints(obj).subscribe((data: any) => {
  //       console.log(data);
  //       this.allusers = [];
  //       this.allusers = data;
  //       this.spinner.hide();
  //     }, err => {
  //       console.log(err);
  //     });
  //     console.log(this.start);
  //     console.log(this.end);
  //   }
  // }

  // previous10Records() {
  //   if (this.start >= 0 && this.end >= 0) {
  //     if (this.start === 0 && this.end === 5) {
  //     } else {
  //       this.spinner.show();
  //       this.start = this.start - 5;
  //       this.end = this.end - 5;
  //       const obj = {
  //         start: this.start,
  //         end: this.end,
  //       };
  //       this.userservc.getallcomplaints(obj).subscribe((data: any) => {
  //         console.log(data);
  //         this.allusers = [];
  //         this.allusers = data;
  //         this.spinner.hide();
  //       }, err => {
  //         console.log(err);
  //         this.spinner.hide();
  //       });
  //       console.log(this.start);
  //       console.log(this.end);
  //     }
  //   }

  // }



  raisecomplaint() {

    const dialogRef = this.dialog.open(HomeComponent, {
      width: 'auto',
      height:'auto',
      data: {
        type:'newComplain'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result === 'success') {
      this.startup(this.userinfo);
      }
    })
  }

  updatecase(i) {
    console.log(i.policeid);
    const obj = {
      policeid:i.policeid
    }
   this.userservc.updatecase(obj).subscribe((data:any) => {
     console.log(data);
     if(data && data.message === 'success') {
      this.startup(this.userinfo);
     }
   })
  }
  
  logout(event) {
    event.stopPropagation();
     this.userservc.logout();
  }
}
