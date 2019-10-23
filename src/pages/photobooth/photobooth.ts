import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, Platform, ToastController, LoadingController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject   } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import { empty } from 'rxjs/Observer';



@IonicPage()
@Component({
  selector: 'page-photobooth',
  templateUrl: 'photobooth.html'
})
export class PhotoboothPage {
  
  public myPhoto: any;
  public myPhotoWatermark: any;

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
              private camera: Camera,
              private transfer: FileTransfer, 
              private file: File, 
              private loadingCtrl:LoadingController,
              public http   : HttpClient,
              private barcodeScanner: BarcodeScanner,
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
  }

  ionViewDidEnter()
  {
  }


  /**
   * Take a photo
   *
   * @public
   * @method takePhoto
   * @return {None}
   */
  takePhoto() : void
  {
    const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth:700,
      targetHeight:1000,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myPhoto = 'data:image/jpeg;base64,' + imageData;

      this.uploadImage();
    }, (err) => {
      // Handle error
    });
    /*if(this.myPhoto!=empty){
    }*/
  }


    /**
   * Upload an image
   *
   * @public
   * @method uploadImage
   * @return {None}
   */
  uploadImage(){  
    //Show loading
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();

    //create file transfer object
    const fileTransfer: FileTransferObject = this.transfer.create();

    //random int
    var random = Math.floor(Math.random() * 100000000);
    this.namePhoto = random+"-"+localStorage.getItem("idEvent");
    //option transfer
    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: "myImage_"+this.namePhoto+".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {}
    }

    //file transfer action
    fileTransfer.upload(this.myPhoto, this.baseURI + 'upload-photo', options)
      .then((data) => {
        //this.presentAlertConfirm("L'image a bien été uploadée.");
        this.myPhotoWatermark = this.baseURI+"images/myImage_"+this.namePhoto+".jpg";
        this.isVisible = true;
        loader.dismiss();
        //this.presentAlertConfirm(JSON.stringify(data));
      }, (err) => {
        console.log(err);
        this.presentAlert("Erreur lors de l'upload, veuillez réessayer");
        loader.dismiss();
      });
  }


  /**
   * Allow navigation to the SharePage
   *
   * @public
   * @method goShare
   * @return {None}
   */
  goAddUserPhotobooth() : void
  {
    //this.presentAlert(this.myPhoto);
    this.navCtrl.push('AddUserPhotobooth', {namePhoto: this.namePhoto});
  }



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




  scanCodeShare() {
    this.barcodeScanner.scan().then(barcodeData => {
      if(barcodeData.cancelled == false){
        this.scannedCode = barcodeData.text;
        var tel  = this.scannedCode.substring(0, this.scannedCode.length - 1);
        tel = tel.replace('https://qrcode.tag.by/vcard?tag=', '');
        console.log('here 1');
        this.selectEntryByQR(tel);
      }else{
        console.log('here 2');
        //this.presentAlert('fff');
      }
    }, (err) => {
     console.log('Error: ', err);
    });
  }



  selectEntryByQR(tel : string) : void
  {
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
      options 	: any		= { "key" : "selectByQR", "tel" : tel, "idEvent" : localStorage.getItem("idEvent")},
      url       : any      	= this.baseURI + "manage-data";

    this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe((data : any) =>
        {
          if (data != null ) {
          this.fields = data;
          //let validations = this.fields[0];
          let telephone = this.fields[1];
          let email = this.fields[2];
          let prenom = this.fields[3];
          let nom = this.fields[4];
          //this.presentAlert(telephone);
          if(telephone != undefined){
            this.createUser(prenom, nom, telephone, email);
          }
          else{
            this.presentAlert('Ce QR code n\'existe pas dans notre base de données');
          }
          console.dir('data : ' + this.fields);
          }else{
            //this.presentAlert('fff!');
          }
        },
        (error : any) =>
        {
          console.dir(error);
        });

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
    options 	: any		= {"key" : "photoBoothCreateByQr", "prenom" : prenom, "nom" : nom, "telephone" : telephone, "email" : theEmail, "nameImg" : nameImg, "idEvent" : id_event},
    url       : any      	= this.baseURI + "manage-data";


this.http
  .post(url, JSON.stringify(options), headers)
  .subscribe(data =>
    {
      this.presentAlertConfirm("the user has been registered");
      console.log(data);
    },
    (error : any) =>
    {
      //this.presentAlert('rrr'+JSON.stringify(error));
      this.presentAlert("something went wrong");
      console.log(error);
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
