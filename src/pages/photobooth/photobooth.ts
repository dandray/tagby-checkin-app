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
      mediaType: this.camera.MediaType.PICTURE
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
    var random = Math.floor(Math.random() * 100);

    //option transfer
    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: "myImage_" + random + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {}
    }

    //file transfer action
    fileTransfer.upload(this.myPhoto, this.baseURI + 'upload-photo.php', options)
      .then((data) => {
        this.presentAlertConfirm("L'image a bien été uploadée");
        this.isVisible = true;
        loader.dismiss();
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
  goShare() : void
  {
    this.navCtrl.push('SharePage');
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
