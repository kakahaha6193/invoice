import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http : HttpClient) { }

  createInvoice(body) {
    let url = environment.host + `invoices/create`;
    return this.http.post<any>(url,body);
  }

  getInvoices() {
    let url = environment.host + `invoices/get-all`;
    return this.http.get<any>(url);
  }

  updateInvoice(body) {
    let url = environment.host + `invoices/update`;
    return this.http.post<any>(url,body);
  }

  sendmail(formdata,invoiceId) {
    let url = environment.host + `mail/send-mail-attachment?invoiceId=${invoiceId}`;
    return this.http.post<any>(url,formdata);
  }
  
  getDetailInvoice(id) {
    let url = environment.host + `invoices/get-invoice-detail?id=${id}`;
    return this.http.get<any>(url);
  }
}
