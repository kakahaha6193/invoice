import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username:any;
  password:any;
  constructor(
    private authenticationService: AuthenticationService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      this.router.navigate(['/invoice']);
    }
  }
  onLogin() {
    let mUser = new User();
    this.authenticationService.login(this.username,this.password)
    .subscribe(res => {
      mUser.token = res.token;
      localStorage.setItem('currentUser', JSON.stringify(mUser));
      this.authenticationService.getMe().subscribe(user => {
        mUser.address = user.address;
        mUser.id = user.id;
        mUser.companyName = user.companyName;
        mUser.roles = user.roles;
        mUser.phoneNumber = user.phoneNumber;
        mUser.email = user.email;
        mUser.username= user.username
        if (mUser && mUser.token) {
            localStorage.setItem('currentUser', JSON.stringify(mUser));
        }
        this.router.navigate(['/invoice']);
      },err => {
        this.toast.error(err.message ? err.message : err);
      })
    },err => {   
       this.toast.error(err.message ? err.message : err);
    })
  }

}
