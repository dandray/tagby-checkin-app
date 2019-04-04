import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, Platform, ToastController, LoadingController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject   } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import { empty } from 'rxjs/Observer';
import { AndroidPermissions } from '@ionic-native/android-permissions';
/*import { SMS } from '@ionic-native/sms';*/

declare var sms : any;

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html'
})
export class SharePage {
  
  public myPhoto: any;

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
  private baseURI               : string  = "http://cdm.tag.by/mobileApp/";


  constructor(public navCtrl: NavController,
              private file: File, 
              private loadingCtrl:LoadingController,
              public http   : HttpClient,
              private barcodeScanner: BarcodeScanner,
              private androidPermissions : AndroidPermissions,
              /*private sms : SMS,*/
              public toastCtrl  : ToastController,
              public alertCtrl  : AlertController)
  {
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
    this.load();
  }




  /**
   * Retrieve the JSON encoded data from the remote server
   * Using Angular's Http class and an Observable - then
   * assign this to the items array for rendering to the HTML template
   *
   * @public
   * @method load
   * @return {None}
   */
  load() : void
  {
    this.http
      .get('http://cdm.tag.by/mobileApp/retrieve-data.php')
      .subscribe((data : any) =>
        {
          //console.dir('load : ' + data);
          this.items = data;
        },
        (error : any) =>
        {
          console.dir(error);
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




  /**
   * Allow navigation to the SharePage
   *
   * @public
   * @method goShare
   * @return {None}
   */
  goShare() : void
  {
    this.navCtrl.push('SharePage');
  }


  

  sendSMS() {
    var messageInfo = {
        phoneNumber: "00972586588285",
        textMessage: "Here is your link : "
      };
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(() => {
          sms.sendMessage(messageInfo, function(message : any) {
              alert(message);
          }, function(error) {
              alert(error);
          });
      }).catch((err) => {
          alert(JSON.stringify(err));
      });

  };
  

  


  /**
   * Allow navigation to the AddUserPage for amending an existing entry
   * (We supply the actual record to be amended, as this method's parameter,
   * to the AddUserPage
   *
   * @public
   * @method viewEntry
   * @param param 		{any} 			Navigation data to send to the next page
   * @return {None}
   */
  viewEntry(param : any) : void
  {
    this.navCtrl.push('AddUserPage', param);
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

}
