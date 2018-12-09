import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';


declare let require: any;
declare let window: any;

let tokenAbi = require('../../../build/contracts/LoyaltyPointSystem.json');

@Injectable({
  providedIn: 'root'
})

export class EthcontractService {
  private web3Provider: null;
  private LoyaltyPointSystemContract:any;

  constructor() {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');


    window.web3 = new Web3(this.web3Provider);
    this.LoyaltyPointSystemContract = TruffleContract(tokenAbi);
    this.LoyaltyPointSystemContract.setProvider(this.web3Provider);
  }

  getAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function(err, account) {

        if(err === null) {
          window.web3.eth.getBalance(account, function(err, balance) {
            if(err === null) {
              return resolve({fromAccount: account, balance:(window.web3.fromWei(balance, "ether")).toNumber()});
            } else {
              return reject({fromAccount: "error", balance:0});
            }
          });
        }
      });
    });
  }


  createCustomer(_name,_email,_phoneNumber,_transferFrom){
    let that = this;
    return new Promise((resolve,reject)=>{

      that.LoyaltyPointSystemContract.deployed().then(function(instance){
        return instance.customerRegister(_name,_email,_phoneNumber,{
          from: _transferFrom,gas:100000
        },
        );
      }).then(function(status) {
        if(status) {
          return resolve({status:true});
        }
      }).catch(function(error){
        console.log(error);

        return reject("Error in create customer");
      });
    });
  }

  getCustomer(customerAddress,_transferFrom){
    let that = this;
    return new Promise((resolve,reject)=>{



      that.LoyaltyPointSystemContract.deployed().then(function(instance){
        return instance.getCustomerInformation.call(customerAddress,{
          from: _transferFrom
        });
      }).then(function(customer) {
        if(customer) {
          return resolve({name:customer[0].toString(),email:customer[1].toString(),phoneNumber:customer[2].toString(),point:customer[3].toString()});
        }
      }).catch(function(error){
        console.log(error);

        return reject("Error in get customer's information");
      });
    });
  }

  earnPoint(amount,_transferFrom){
    let that = this;
    return new Promise((resolve,reject)=>{
      that.LoyaltyPointSystemContract.deployed().then(function(instance){
        return instance.earnPoint(amount,{
          from: _transferFrom,gas:100000
        });
      }).then(function(status){
        if(status) {
          return resolve({status:true});
        }
      }).catch(function(error){
        console.log(error);

        return reject("Error in earn point");
      });
    });
  }
  
  usePoint(amount,_transferFrom){
    let that = this;
    return new Promise((resolve,reject)=>{
      that.LoyaltyPointSystemContract.deployed().then(function(instance){
        return instance.usePoint(amount,{
          from: _transferFrom,gas:100000
        });
      }).then(function(status){
        if(status) {
          return resolve({status:true});
        }
      }).catch(function(error){
        console.log(error);

        return reject("Error in earn point");
      });
    });
  }

  sendPoint(amount,_transferTo,_transferFrom){
    let that = this;
    return new Promise((resolve,reject)=>{
      that.LoyaltyPointSystemContract.deployed().then(function(instance){
        return instance.sendPoint(_transferTo,amount,{
          from: _transferFrom,gas:100000
        });
      }).then(function(status){
        if(status) {
          return resolve({status:true});
        }
      }).catch(function(error){
        console.log(error);

        return reject("Error in earn point");
      });
    });
  }

}
