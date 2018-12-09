import { Component } from '@angular/core';
import { EthcontractService } from './ethcontract.service';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Loyalty Point System ';
  accounts: any;
  transferFrom = '0x0';
  balance = '0 ETH';
  transferTo = '';
  amount = '';
  remarks = '';
  name: string;
  email: string;
  phoneNumber: number;
  nameRegister: string;
  emailRegister: string;
  phoneNumberRegister: number;
  point: number;
  pointEarned:number;
  pointUsed:number;
  pointSent:number;
  private _success = new Subject<string>();
  private _error = new Subject<string>();


  staticAlertClosed = false;
  successMessage: string;
  errorMessage: string;

  constructor(private ethcontractService: EthcontractService) {
  }
  
  ngOnInit(): void {
    this.initAndDisplayAccount();
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);

    this._error.subscribe((message) => this.errorMessage = message);
    this._error.pipe(
      debounceTime(5000)
    ).subscribe(() => this.errorMessage = null);
  }

  initAndDisplayAccount = () => {
    let that = this;
    this.ethcontractService.getAccountInfo().then(function (acctInfo: any) {
      console.log(acctInfo);
      that.transferFrom = acctInfo.fromAccount;
      that.balance = acctInfo.balance;
      that.ethcontractService.getCustomer(that.transferFrom, that.transferFrom).then(function (customer: any) {
        console.log(customer);
        that.name = customer.name;
        that.email = customer.email;
        that.phoneNumber = customer.phoneNumber;
        that.point = customer.point;
      }).catch(function (error) {
        console.log(error);
      })
    }).catch(function (error) {
      console.log(error);
    });

  };

  customerRegister() {
    let that = this;
    console.log(this.transferTo);
    console.log(this.transferFrom);
    this.ethcontractService.createCustomer(this.nameRegister, this.emailRegister, this.phoneNumberRegister, this.transferFrom).then(function () {
      that.initAndDisplayAccount();
      that._success.next(` Register successfully!`);
    }).catch(function (error) {
      console.log(error);
      that._error.next(` Register fail!`);
      
    })
  }

  earnPoint(){
    let that = this;
    this.ethcontractService.earnPoint(this.pointEarned,this.transferFrom).then(function(){
      that.initAndDisplayAccount();
      that._success.next(` You have earned ${that.pointEarned} point!`);
      

    }).catch(function(error){
      console.log(error);
      that._error.next(` Can not earn point!`);
      
    })

  }
  usePoint(){
    let that = this;
    this.ethcontractService.usePoint(this.pointUsed,this.transferFrom).then(function(){
      that.initAndDisplayAccount();
      that._success.next(` You have used ${that.pointUsed} point!`);

    }).catch(function(error){
      console.log(error);
      that._error.next(` Can not use point!`);

    })

  }

  sendPoint(){
    let that = this;
    this.ethcontractService.sendPoint(this.pointSent,this.transferTo,this.transferFrom).then(function(){
      that.initAndDisplayAccount();
      that._success.next(` You have sent ${that.pointSent} point to ${that.transferTo}!`);

    }).catch(function(error){
      console.log(error);
      that._error.next(` Can not send point!`);

    })

  }
}
