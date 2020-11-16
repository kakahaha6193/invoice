import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  menuSelect = 0;
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  
  chooseMenu(index) {
    this.menuSelect = index;
    switch (index) {
      case 0:
        this.router.navigate(['invoice'])
        break;
      default:
        this.router.navigate(['invoice/new'])
        break;
    }
  }
  gotoInvoice() {
    this.router.navigate(['invoice'])
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('login')
  }
}
