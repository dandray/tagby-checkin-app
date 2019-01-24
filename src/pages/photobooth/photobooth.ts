import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, Platform, ToastController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";


@IonicPage()
@Component({
  selector: 'page-photobooth',
  templateUrl: 'photobooth.html'
})
export class PhotoboothPage {

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
  private baseURI               : string  = "http://cdm.tag.by/mobileApp/";


  constructor(public navCtrl: NavController,
              public http   : HttpClient,
              private barcodeScanner: BarcodeScanner,
              public plt: Platform,
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
   * Allow navigation to the PhotoboothPage
   *
   * @public
   * @method goPhotobooth
   * @return {None}
   */
  takePhoto() : void
  {
    this.navCtrl.push('PhotoboothPage');
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


  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      this.selectEntryByQR(this.scannedCode);
    }, (err) => {
      console.log('Error: ', err);
    });


  }


  /**
   */
  selectEntryByQR(tel : string) : void
  {

    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
      options 	: any		= { "key" : "selectByQR", "tel" : tel},
      url       : any      	= this.baseURI + "manage-data.php";

    this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe((data : any) =>
        {
          this.fields = data;
          let validations = this.fields[0];
          let nb_places   = this.fields[1];
          if(validations != undefined){
            //Si le nombre de validations est >= au nombre de places, on ne valide pas
            if(validations >=nb_places){
              this.presentAlert('Cet utilisateur a déjà validé toutes ses places!');
            }
            else{
              this.updateEntryByQR(this.scannedCode);
            }
          }
          else{
            this.presentAlert('Ce QR code n\'existe pas dans notre base de données');
          }
          console.dir('data : ' + this.fields);
        },
        (error : any) =>
        {
          console.dir(error);
        });

  }


  /**
   * Update an existing record that has been edited in the page's HTML form
   * Use angular's http post method to submit the record data
   * to our remote PHP script
   *
   * @public
   * @method updateEntry
   * @param validation 			{Number} 	validation value
   * @param tel 	          {String} 		tel value from QR Scan
   * @return {None}
   */
  updateEntryByQR(tel : string) : void {
    let headers: any = new HttpHeaders({'Content-Type': 'application/json'}),
      options: any = {"key": "updateByQR", "tel": tel},
      url: any = this.baseURI + "manage-data.php";

    console.dir('updateFunction : ' + tel);
    this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data => {
          // If the request was successful notify the user
          this.hideContent = true;
          this.presentAlertConfirm(`1 place validée`);
        },
        (error: any) => {
          this.presentAlert('Something went wrong!');
        });
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

}
