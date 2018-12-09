import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { EthcontractService } from './ethcontract.service';
import {InputTextModule} from 'primeng/inputtext';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InputTextModule,
    NgbModule,
    FormsModule
  ],
  providers: [EthcontractService],
  bootstrap: [AppComponent]
})
export class AppModule { }
