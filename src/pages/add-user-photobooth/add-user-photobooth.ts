import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController, LoadingController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject   } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import { empty } from 'rxjs/Observer';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { EmailComposer } from '@ionic-native/email-composer';
import { SMS } from '@ionic-native/sms';



declare var sms : any;

@IonicPage()
@Component({
  selector: 'page-add-user-photobooth',
  templateUrl: 'add-user-photobooth.html'
})
export class AddUserPhotobooth {
  
  public namePhoto: string;

  public items : Array<any> = [];

  public fields : Array<any> = [];

  public scannedCode = null;


  //Variable permettant de voir ou pas le bouton share
  public isVisible = false;


  /**
   * @name baseURI
   * @type {String}
   * @public
   * @description     Remote URI for retrieving data from and sending data to
   */
  private baseURI               : string  = "https://qrcode.tag.by/mobileApp/";


  constructor(public navCtrl: NavController,
              private file: File, 
              private loadingCtrl:LoadingController,
              public http   : HttpClient,
              private barcodeScanner: BarcodeScanner,
              private androidPermissions : AndroidPermissions,
              public toastCtrl  : ToastController,
              private sms: SMS,
              public alertCtrl  : AlertController,
              private emailComposer: EmailComposer,
              public navParams: NavParams)
  {
    this.namePhoto = navParams.get('namePhoto');
  }




  /**
   * Triggered when template view is about to be entered
   * Returns and parses the PHP data through the load() method
   *
   * @public
   * @method ionViewWillEnter
   * @return {None}
   */
  ionViewWillEnter() : void
  {
  }

  ionViewDidEnter()
  {
      //this.presentAlert(this.namePhoto);

  }



  sendEmail() :void 
  {
    //this.createUser();
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send

      }
     });

     let email = {
      to: 'yehoshoua.ch@gmail.com',
      subject: 'Ionic app Test',
      body: 'How are you? Nice greetings from ME',
      isHtml: true
    };
    
    // Send a text message using default options
    this.emailComposer.open(email);
    
  }


   /**
   *Create a user in the database name of the img phone email etc... (link, bitly create in the php page with the image name), and send mail and sms
   *
   * @public
   * @method createUser
   * @return {None}
   */
  createUser(firstname : String, lastname : String, phone : String, email : String) : void{
    var prenom = firstname;
    var nom = lastname;
    var telephone = phone;
    var theEmail = email;
    var nameImg = this.namePhoto;
    var id_event = localStorage.getItem("idEvent");

    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'}),
    options 	: any		= {"key" : "photoBoothCreate", "prenom" : prenom, "nom" : nom, "telephone" : telephone, "email" : theEmail, "nameImg" : nameImg, "idEvent" : id_event},
    url       : any      	= this.baseURI + "manage-data";


this.http
  .post(url, JSON.stringify(options), headers)
  .subscribe(data =>
    {
      this.presentAlertConfirm("the user has been registered");
      console.log(data);
      this.navCtrl.pop();
    },
    (error : any) =>
    {
      console.log(error);
      this.presentAlert("Please check that the message has been set in photobooth setting in qrcode.tag.by");
    });

  }
/*
  socialTag() :void 
  {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(() => {
      //this is to send SMS
      this.sms.send('00972586588285', 'Hello world!');
      }).catch((err) => {
       alert(JSON.stringify(err));
      });
    /* Send a text message using default options
    this.sms.send('00972586588285', 'Hello world!');
  }*/


  goPhotobooth(){

    this.navCtrl.push('PhotoboothPage');
  }
  
  goShareQr(){

    //this.sendSMS();
  }

  sendSMS() {

        var phoneNumber: "00972586017936";
        var textMessage: "test";
        this.sms.send(phoneNumber, textMessage).then(()=>{
          alert("yes");
        }).catch((err) => {
          alert(JSON.stringify(err));
        });
  }

  


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

}
