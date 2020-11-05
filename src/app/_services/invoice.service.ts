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
}
