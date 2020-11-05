import { Component, OnInit } from '@angular/core';
// import * as $ from 'jquery'
@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {

  constructor() { 
    
  }

  ngOnInit() {
  
  }
  
  print() {
    window.print();
  }
}
