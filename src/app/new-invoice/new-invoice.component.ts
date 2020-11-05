import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from '../_services';
import * as $ from 'jquery';
@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss']
})
export class NewInvoiceComponent implements OnInit {
  checkoutForm;
  amount =  {
    balance: 0,
    discount: 0,
    paidToDate: 0,
    subTotal: 0,
    tax: 0,
    total: 0
  }
  productList= [
    {
      currencyUnit: "",
      name: "",
      price: 0,
      quantity: 0,
      total: 0,
    }
  ]
  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public invoiceService: InvoiceService
  ) { }

  ngOnInit() {
    this.checkoutForm = this.formBuilder.group({
      invoiceCode: '222',
      issueDate: '',
      dueDate: '',
      productName: '',
      customerName: '',
      address: '',
      customerEmail: '',
      phoneNumber: '',
      note: '',
      paymentTerm: ''
    });
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
    }
    this.productList.push(item);
  }

  removeProductFromList(index) {
    this.productList.splice(index,1);
  }
}
