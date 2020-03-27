import { Component, OnInit, Optional, Inject } from '@angular/core';
import { UserService } from '../_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userinfo:any;
  complainform:FormGroup;

  constructor(public userservc:UserService,private spinner:NgxSpinnerService,
    private router:Router,
    @Optional() public dialogRef: MatDialogRef<HomeComponent>,
    public toast: ToastrService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogdata,
    public formbuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.complainform = this.formbuilder.group({
      vname:[null,Validators.compose([Validators.required])],
      vnumb:[null,Validators.compose([Validators.required])],
      pan:[null,Validators.compose([Validators.required])],
      chasis:[null,Validators.compose([Validators.required])] 
    })


    this.userinfo = null;
    this.userinfo = JSON.parse(localStorage.getItem('currentUser'));
  }

  get formControls() { return this.complainform.controls; }

  complainForm() {
    if (this.complainform.valid) {
      this.spinner.show();
      this.complainform.value.userID = this.userinfo.username;
      this.userservc.createcomplaint(this.complainform.value).subscribe((data:any) => {
        console.log(data);
        this.spinner.hide();
        if (data && data.message === 'success') {
          this.toast.success('Complaint Placed Successfully !!!');
          this.dialogRef.close('success');
        }
      }, err => {
        this.spinner.hide();
      })
    }
  }
  
  _handleKeydown(event) {
    if (event.keyCode === 32) {
      event.stopPropagation();
    }
    if (event.which === 32 && event.target.selectionStart === 0) {
      return false;
    }

  }

}
