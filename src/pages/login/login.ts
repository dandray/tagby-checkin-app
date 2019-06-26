import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, Platform, ToastController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  /**
   * @name items
   * @type {Array}
   * @public
   * @description     Used to store returned PHP data
   */
  public items : Array<any> = [];

  public fields : Array<any> = [];

  /**
   * Données du QR Code
  */
  public scannedCode = null;


  //Variable permettant de voir ou pas les résultats de recherche
  public isVisible = false;


  /**
   * @name baseURI
   * @type {String}
   * @public
   * @description     Remote URI for retrieving data from and sending data to
   */
  private baseURI               : string  = "https://qrcode.tag.by/mobileApp/";


  /**
   * @name hideContent
   * @type {Boolean}
   * @public
   * @description     Flag to hide the content upon successful completion of remote operation
   */
  public hideContent               : boolean = false;


  constructor(public navCtrl: NavController,
              public http   : HttpClient,
              private barcodeScanner: BarcodeScanner,
              public plt: Platform,
              public toastCtrl  : ToastController,
              public alertCtrl  : AlertController)
  {
  }


  ionViewDidEnter()
  {
    //this.presentAlert(localStorage.getItem("idEvent"));
  }
  ionViewWillEnter()
  {
    if(localStorage.getItem("idEvent") != null)
    {
      this.goMenu();
    }
    //this.presentAlert(localStorage.getItem("idEvent"));
  }

  /** 
   * login and store the id event
   * 
  * @public
  * @method login
  * @return {None}
  * 
  **/ 

  login(username : string, password : string): void
  {
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
    options 	: any		= { "username" : username, "password" : password},
    url       : any      	= this.baseURI + "login";


this.http
  .post(url, JSON.stringify(options), headers)
  .subscribe(data =>
    {
      // If the request was successful notify the user
      if (data != null ) {
        // your code here
      
      if(data[0]=='loginOk'){
        // Store
        localStorage.setItem("idEvent", data[1]); // we keep the id to display the right users to validate, logo title etc (from adidas, raanana etc...)
        // Retrieve
        console.log(localStorage.getItem("idEvent"));
        this.goMenu();
      }
    }else{
      this.presentAlert("Password or Username incorrect");


    }
    },
    (error : any) =>
    {
      this.presentAlert('something went wrong!');
    });
    
  }

  
  /** 
  * @public
  * @method goSearch
  * @return {None}
  * 
  **/ 
  goMenu() : void
  {
    this.navCtrl.push('HomePage');
  }



  /**
   * Manage notifying the user of the outcome of remote operations
   *
   * @public
   * @method sendNotification
   * @param message 	{String} 			Message to be displayed in the notification
   * @return {None}
   */
  sendNotification(message : string)  : void
  {
    let notification = this.toastCtrl.create({
      message       : message,
      duration      : 3000
    });
    notification.present();
  }

  presentAlert(myMessage: string) {
    let alert = this.alertCtrl.create({
      title: 'Attention',
      message : myMessage,
      buttons: ['OK']
    });
    alert.present();
  }

  presentAlertConfirm(myMessage: string) {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      message : myMessage,
      buttons: ['OK']
    });
    alert.present();
  }



  /**
   * Filter technologies array by type selected
   *
   * @public
   * @method onFilter
   @ param val     {String}		The string value supplied by the <ion-radio> when selected
   * @return {None}
   */
  onFilter(category : string) : void
  {

    // Only filter the technologies array IF the selection is NOT equal to value of all
    if (category.trim() !== 'all')
    {
      this.items = this.items.filter((item) =>
      {
        return item.lastname.toLowerCase().indexOf(category.toLowerCase()) > -1;
      })
    }
  }



}
