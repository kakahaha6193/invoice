import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { PageNotFoundComponent } from './_guards/page-not-found/page-not-found.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'invoice', component: MainComponent ,
      children: [
        {
          path: '', component: InvoicesComponent,
        },{
          path: 'detail/:id', component: InvoiceDetailComponent,
        },{
          path: 'new', component: NewInvoiceComponent,
        },{
          path: 'edit/:id', component: EditInvoiceComponent,
        }
      ]
    },
    // otherwise redirect to home
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
