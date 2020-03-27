import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder, Validators} from '@angular/forms'
import { UserService } from '../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm:FormGroup;
  passwordtype = 'password'; // ---------------It is declared for initial condition for show password value---------------//
  showPass = false; // ---------------used for onclick change show password---------------//
  constructor(private formbuilder: FormBuilder, private usersrvc: UserService,private router:Router
    ,private spinner:NgxSpinnerService, private toast:ToastrService) { }

  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({
      firstname: [null,Validators.compose([Validators.required,Validators.pattern(/[a-z A-Z]{3,45}/)])],
      lastname: [null,Validators.compose([Validators.required,Validators.pattern(/[a-z A-Z]{3,45}/)])],
      username: [null,Validators.compose([Validators.required,Validators.pattern(/[a-z A-Z]{3,45}/)])],
      pswd: [null,Validators.compose([Validators.required,Validators.pattern(/^(?!.* )(?=.*\d)(?=.*[A-Z])(?=.*?[@_.]).{8,15}$/)])]
    });
  }

  get formControls() { return this.registerForm.controls; }

  registerUser(event) {
        console.log(this.registerForm.value);
        if( this.registerForm.valid) {
          event.stopPropagation();
      this.spinner.show();
        this.usersrvc.createUser(this.registerForm.value).subscribe((data: any) => {
        console.log(data);
        this.spinner.hide();
        if (data && data.userrole && data.username) {
          this.toast.success('User Registered Successfully !!!');
          localStorage.setItem('currentUser',JSON.stringify(data));
           this.router.navigate(['audit']);
        } else if (data && data.message) {
         this.toast.warning(data.message);
        }
      },err => {
        console.log(err);
        this.spinner.hide();
        this.toast.error(err);
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

  
    /*** input:none;*
   *    output:displays password value*/
  // -------------------------function called for Show password-------------//
  hideShowPassword() {
    this.showPass = !this.showPass;
    console.log(this.showPass);
    if (this.showPass) {
      this.passwordtype = 'text';
    } else {
      this.passwordtype = 'password';
    }
  }
  

}
