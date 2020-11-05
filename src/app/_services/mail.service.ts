import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http : HttpClient) { }

  sendMailAndAttachFile (invoiceId,formData) {
    let url = environment.host + `mails/send-mail-attachment?invoiceId=${invoiceId}`;
    return this.http.post<any>(url,formData);
  }
}
