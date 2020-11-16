import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from '../_services';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss']
})
export class EditInvoiceComponent implements OnInit {
  idInvoice: number;
  invoice: any;
  @Output() directEvent = new EventEmitter<number>();
  checkoutForm: FormGroup;
  amount = {
    balance: 0,
    discount: 0,
    paidToDate: 0,
    subTotal: 0,
    tax: 0,
    total: 0
  }
  listTotalItem = [];
  constructor(private service: InvoiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, 
    private toast : ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.idInvoice = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this.getDetailInvoice();
  }

  initValueDefault(invoice) {
    this.checkoutForm = this.formBuilder.group({
      invoiceCode: invoice ? invoice.invoiceCode : '',
      issueDate: moment(new Date()).format('YYYY-MM-DD'),
      dueDate: moment(new Date()).format('YYYY-MM-DD'),
      productName:   '',
      customerName: invoice && invoice.customer && invoice.customer.customerName ? invoice.customer.customerName : '',
      address: invoice && invoice.customer && invoice.customer.address ? invoice.customer.address : '',
      customerEmail: invoice && invoice.customer && invoice.customer.customerEmail ? invoice.customer.customerEmail : '',
      phoneNumber: invoice && invoice.customer && invoice.customer.phoneNumber ? invoice.customer.phoneNumber : '',
      note: invoice && invoice.note ? invoice.note : '',
      paymentTerm:  invoice && invoice.paymentTerm ? invoice.paymentTerm : '',
      productList: this.formBuilder.array([
      ])
    });
  }

  listenValueChanges() {
    this.productList.valueChanges.pipe(debounceTime(1000)).subscribe(res => {
      this.amount.total = 0;
      this.amount.discount = 0;
      this.amount.tax = 0;
      this.amount.subTotal = 0;
      res.map((item, index) => {
        this.listTotalItem[index] = this.sumaryTotal(item.quantity, item.price, item.tax, item.discount);
        this.amount.total +=  this.listTotalItem[index];
        this.amount.discount += this.sumaryDisccount(item.quantity, item.price, item.discount);
        this.amount.tax += this.sumaryTax(item.quantity, item.price, item.tax);
        this.amount.subTotal += this.sumarySubTotal(item.quantity, item.price);
      })
    })
  }

  getDetailInvoice() {
    this.service.getDetailInvoice(this.idInvoice).subscribe(res => {
      this.invoice = res;
      this.initValueDefault(this.invoice);
      this.listenValueChanges();
      this.invoice.productList.map((item,index) => {
        this.addItemToCart(item);
      })
      this.amount = this.invoice.amount;
    },err => {
      this.toast.error(err.message ? err.message : err);
    })
  }
  
  sumaryTotal(quantity, price, tax, discount) {
    tax = tax ? tax : 0;
    discount = discount ? discount : 0;
    let monDiscount = quantity * discount * price / 100;
    let monTax = quantity * parseFloat(tax) * price / 100;
    let total = quantity * price + monTax - monDiscount;
    return total;
  }

  sumarySubTotal(quantity, price) {
    return quantity * price;
  }
  sumaryDisccount(quantity, price, discount) {
    discount = discount ? discount : 0;
    return quantity * discount * price / 100;
  }

  sumaryTax(quantity, price, tax) {
    tax = tax ? tax : 0;
    return quantity * parseFloat(tax) * price / 100;
  }
  clearBill() {
    this.checkoutForm.reset();
  }

  addItemToCart(item?) {
    let mItem = {
      currencyUnit: item ? item.currencyUnit : '',
      name: item ? item.name : '',
      price: item ? item.price : 0,
      quantity: item ? item.quantity : 0,
      tax: 0,
      discount: 0
    }
    this.productList.push(this.formBuilder.group(mItem));
  }

  removeProductFromList(index) {
    this.productList.removeAt(index);
    this.listTotalItem.splice(index,1);
  }
 
  saveInvoice(){
    let body = {
      amount: this.amount,
      id: this.idInvoice,
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
    this.service.updateInvoice(body).subscribe(res => {
      this.directEvent.emit(1);
      
      this.toast.success("Create Success Fully!");
    }, err => {
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
