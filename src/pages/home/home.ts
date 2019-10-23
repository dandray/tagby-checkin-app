import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, Platform, ToastController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

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


  ionViewDidEnter()
  {
    //this.presentAlert(localStorage.getItem("idEvent"));
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
      .get('https://qrcode.tag.by/mobileApp/retrieve-data?idEvent='+localStorage.getItem("idEvent"))
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
   * Allow navigation to the AddUserPage for creating a new entry
   *
   * @public
   * @method addEntry
   * @return {None}
   */
  addEntry() : void
  {
    this.navCtrl.push('AddUserPage');
  }


  /**
   * Allow navigation to the SearchPage
   *
   * @public
   * @method goSearch
   * @return {None}
   */
  goSearch() : void
  {
    this.navCtrl.push('SearchPage');
  }


  /**
   * Allow navigation to the ScanPage
   *
   * @public
   * @method goScan
   * @return {None}
   */
  goScan() : void
  {
    this.navCtrl.push('ScanPage');
  }

  /**
   * Allow navigation to the PhotoboothPage
   *
   * @public
   * @method goPhotobooth
   * @return {None}
   */
  goPhotobooth() : void
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

  /**
   * Filter technologies array by keyword/letter
   *
   * @public
   * @method filtertechnologies
   @ param event     {Object}		The event object emitted by the <ion-searchbar> when input is entered
   * @return {None}
   */
  filterUsersFirstName(param : any) : void
  {

    let val : string 	= param;

    // DON'T filter the technologies IF the supplied input is an empty string
    if(val==undefined){
      val = '';
    }
    if(val!=undefined){
      if (val.trim() !== '')
      {
        this.items = this.items.filter((item) =>
        {
          return item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1;
        })
      }
      else{
        this.load();
        this.isVisible = false;
      }
    }
  }

  /**
   * Filter technologies array by keyword/letter
   *
   * @public
   * @method filtertechnologies
   @ param event     {Object}		The event object emitted by the <ion-searchbar> when input is entered
   * @return {None}
   */
  filterUsersLastName(param : any) : void {

    let val: string = param;

    // DON'T filter the technologies IF the supplied input is an empty string
    if(val==undefined){
      val = '';
    }
      if (val.trim() !== '') {
        this.items = this.items.filter((item) => {
          return item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1;
        })
      } else {
        this.load();
      }

  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      if(barcodeData.cancelled == false){
        this.scannedCode = barcodeData.text;
        var tel  = this.scannedCode.substring(0, this.scannedCode.length - 1);
        tel = tel.replace('https://qrcode.tag.by/vcard?tag=', '');
        this.selectEntryByQR(tel);
      }else{
        //this.presentAlert('fff');
      }
    }, (err) => {
     console.log('Error: ', err);
    });
  }

  


  /*
  scanCode2(){
    let options: ZBarOptions = {
      flash: 'auto',
      drawSight: false,
      text_title : 'Scannez un QR code',
      text_instructions : 'Placez le QR dans la zone de scan'
    };

    this.zbar.scan(options)
      .then(result => {
        console.log('result : '+ result); // Scanned code
        this.scannedCode = result.text;
        this.selectEntryByQR(this.scannedCode);
      })
      .catch(error => {
        console.log(error); // Error message
        this.presentAlert('Le QR Code n\'a pas été scanné');
      });
  }
*/



  /**
   */
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
          let validations = this.fields[0];
          let nb_places   = this.fields[1];
          if(validations != undefined){
            //Si le nombre de validations est >= au nombre de places, on ne valide pas
            if(validations >=nb_places){
              this.presentAlert('Cet utilisateur a déjà validé toutes ses places!');
            }
            else{
              this.updateEntryByQR(tel);
            }
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
      options: any = {"key": "updateByQR", "tel": tel, idEvent:localStorage.getItem("idEvent")},
      url: any = this.baseURI + "manage-data";

    console.dir('updateFunction : ' + tel);
    this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data => {
          // If the request was successful notify the user
          this.hideContent = true;
          this.presentAlertConfirm(`utilisateur validé`);
        },
        (error: any) => {
          this.presentAlert('Something went wrong!');
        });
  }

  logout(){

    localStorage.clear();
    this.navCtrl.push('LoginPage');
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


