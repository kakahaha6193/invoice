import jsPDF from "jspdf";
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { InvoiceService } from '../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  idInvoice: number;
  invoice: any;

  constructor(private service: InvoiceService,
    private route: ActivatedRoute, 
    private toast : ToastrService,
    private router: Router) { 
  }

  ngOnInit() {
   this.idInvoice = Number.parseInt(this.route.snapshot.paramMap.get('id'));
   this.getDetailInvoice();
   
  }
  
  getDetailInvoice() {
    this.service.getDetailInvoice(this.idInvoice).subscribe(res => {
      this.invoice = res;
    },err => {
      this.toast.error(err.message ? err.message : err);
    })
  }
  sendEmail() {
    this.makePdf();
  }
  print() {
    window.print();
  }

  makePdf() {
    let doc = new jsPDF();
    let that = this;
    doc.addHTML(this.content.nativeElement, function () {
      let data = doc.output('blob');
      console.log(data);
      let formdata = new FormData();
      that.service.sendmail(formdata,that.invoice.id).subscribe(data => {
        that.toast.success('Send mail successed');
      },err => {
        that.toast.error(err.message ? err.message : err);
      })
      // doc.save("invoice.pdf");
    });
  }

  sendInvoice() {
    this.makePdf();
  }

  edit() {
    this.router.navigate(['invoice/edit',this.idInvoice])
  }
}
