import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import { InvoiceService } from '../_services/invoice.service';
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  listInvoice= []
  constructor(private toast: ToastrService,
    public invoiceService: InvoiceService) { }

  ngOnInit() {
    console.log("aaaaaaaaa");
    this.getAll();
  }
  
  getAll() {
    this.invoiceService.getInvoices().subscribe(res => {
      this.listInvoice = res;
      console.log('listInvoice',this.listInvoice)
    },err => {
      this.toast.error(err.message ? err.message : err);
    })
  }


}
