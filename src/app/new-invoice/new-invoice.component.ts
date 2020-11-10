import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from '../_services';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { jsPDF } from "jspdf";
@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss']
})
export class NewInvoiceComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  checkoutForm: FormGroup;
  amount =  {
    balance: 0,
    discount: 0,
    paidToDate: 0,
    subTotal: 0,
    tax: 0,
    total: 0
  }
  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public invoiceService: InvoiceService
  ) { }

  ngOnInit() {
    this.checkoutForm = this.formBuilder.group({
      invoiceCode: '',
      issueDate: moment(new Date()).format('YYYY-MM-DD'),
      dueDate:  moment(new Date()).format('YYYY-MM-DD'),
      productName: '',
      customerName: '',
      address: '',
      customerEmail: '',
      phoneNumber: '',
      note: '',
      paymentTerm: '',
      productList : this.formBuilder.array([
      ])
    });
     
    this.productList.valueChanges.pipe(debounceTime(1000)).subscribe(res => {
      this.amount.total = 0;
      this.amount.discount = 0;
      this.amount.tax = 0;
      this.amount.subTotal = 0;
      res.map(item => {
        item.total = this.sumaryTotal(item.quantity,item.price,item.tax,item.discount);
        this.amount.total += item.total;
        this.amount.discount += this.sumaryDisccount(item.quantity,item.price,item.discount);
        this.amount.tax += this.sumaryTax(item.quantity,item.price,item.tax);
        this.amount.subTotal += this.sumarySubTotal(item.quantity,item.price);
      })
    })
  }

  sumaryTotal(quantity,price,tax, discount) {
    let monDiscount = quantity * discount * price / 100;
    let monTax = quantity * parseFloat(tax) * price / 100;
    let total = quantity * price + monTax - monDiscount;
    return total;
  }
  
  sumarySubTotal(quantity,price) {
    return quantity * price;
  }
  sumaryDisccount(quantity,price,discount) {
    return quantity * discount * price / 100;
  }
  makePdf() { 
    let doc = new jsPDF();
    doc.addHTML(this.content.nativeElement, function() {
       doc.save("invoice.pdf");
    });
  }
  sendInvoice() {
    console.log()
    this.makePdf();
  }
  sumaryTax(quantity,price,tax) {
    return quantity * parseFloat(tax) * price / 100;
  }
  clearBill() {
    this.checkoutForm.reset();
  }
  addItemToCart() {
    let item = {
      currencyUnit: "",
      name: "",
      price: 0,
      quantity: 0,
      total: 0,
      tax: 0,
      discount: 0
    }
    this.productList.push(this.formBuilder.group(item));
  }

  removeProductFromList(index) {
    this.productList.removeAt(index);
  }

  createInvoice() {
    let body= {
      amount: this.amount,
      customer: {
        address: this.address,
        customerEmail: this.customerEmail,
        customerName: this.customerName,
        phoneNumber: this.phoneNumber
      },
      invoiceCode: this.invoiceCode,
      note: this.note,
      paymentTerm: this.paymentTerm,
      productList: this.productList.value
    }
    this.invoiceService.createInvoice(body).subscribe(res => {
      this.toast.success("Create Success Fully!") 
    },err => {
      this.toast.error(err.message ? err.message : err);
    })
  }


  get address() {
    return this.checkoutForm.get('address').value as string;
  }

  get customerEmail() {
    return this.checkoutForm.get('customerEmail').value as string;
  }

  get customerName() {
    return this.checkoutForm.get('customerName').value as string;
  }

  get phoneNumber() {
    return this.checkoutForm.get('phoneNumber').value as string;
  }

  get note() {
    return this.checkoutForm.get('note').value as string;
  }

  get paymentTerm() {
    return this.checkoutForm.get('paymentTerm').value as string;
  }

  get invoiceCode() {
    return this.checkoutForm.get('invoiceCode').value as string;
  }

  get productList() {
    return this.checkoutForm.get('productList') as FormArray;
  }

  get issueDate() {
    return this.checkoutForm.get('issueDate').value as string;
  }

  get dueDate() {
    return this.checkoutForm.get('dueDate').value as string;
  }
}
