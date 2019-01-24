import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Printer, PrintOptions } from '@ionic-native/printer';

import { HomePage } from '../home/home';



@IonicPage()
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html'
})
export class AddUserPage {

  /**
   * @name form
   * @type {FormGroup}
   * @public
   * @description     Define FormGroup property for managing form validation / data retrieval
   */
  public form                   : FormGroup;




  /**
   * @name userFirstName
   * @type {Any}
   * @public
   * @description     Model for managing userFirstName field
   */
  public userFirstName         : any;


  /**
   * @name userLastName
   * @type {Any}
   * @public
   * @description     Model for managing userLastName field
   */
  public userLastName  : any;

  /**
   * @name userEmail
   * @type {Any}
   * @public
   * @description     Model for managing userEmail field
   */
  public userEmail  : any;

  /**
   * @name userTel
   * @type {Any}
   * @public
   * @description     Model for managing userTel field
   */
  public userTel  : any;

  //Champs d'affichage du numéro de téléphone avec un format lisible
  public userTelDisplay : any;

  /**
   * @name userNumeroTable
   * @type {Any}
   * @public
   * @description     Model for managing userNumeroTable field
   */
  public userNumeroTable  : any;

  /**
   * @name userNbPlaces
   * @type {Any}
   * @public
   * @description     Model for managing userNbPlaces field
   */
  public userNbPlaces  : any;

  /**
   * @name userTypePaiement
   * @type {Any}
   * @public
   * @description     Model for managing userTypePaiement field
   */
  public userTypePaiement : any;

  /**
   * @name userManager
   * @type {Any}
   * @public
   * @description     Model for managing userManager field
   */
  public userManager  : any;

  /**
   * @name userValidation
   * @type {Any}
   * @public
   * @description     Model for managing userValidation field
   */
  public userValidation : any;

  //Champs d'affichage du nombre de validations que l'on va ajouter au nombre de validations présent en base de données
  public nbValidations : any;


  /**
   * @name isEdited
   * @type {Boolean}
   * @public
   * @description     Flag to be used for checking whether we are adding/editing an entry
   */
  public isEdited               : boolean = true;




  /**
   * @name hideForm
   * @type {Boolean}
   * @public
   * @description     Flag to hide the form upon successful completion of remote operation
   */
  public hideForm               : boolean = false;




  /**
   * @name pageTitle
   * @type {String}
   * @public
   * @description     Property to help set the page title
   */
  public pageTitle              : string;




  /**
   * @name recordID
   * @type {String}
   * @public
   * @description     Property to store the recordID for when an existing entry is being edited
   */
  public recordID               : any      = null;




  /**
   * @name baseURI
   * @type {String}
   * @public
   * @description     Remote URI for retrieving data from and sending data to
   */
  private baseURI               : string  = "http://cdm.tag.by/mobileApp/";




  // Initialise module classes
  constructor(public navCtrl    : NavController,
              public http       : HttpClient,
              public NP         : NavParams,
              public fb         : FormBuilder,
              public toastCtrl  : ToastController,
              public alertCtrl  : AlertController,
              public printer   : Printer)
  {

    // Create form builder validation rules
    this.form = fb.group({
      "firstname"                  : ["", Validators.required],
      "lastname"           : ["", Validators.required],
      "validation"           : ["", Validators.required],
      "email"           : ["", Validators.required],
      "tel"           : ["", Validators.required],
      "numero_table"           : ["", Validators.required],
      "nb_places"           : ["", Validators.required]
    });
    
  }

  



  /**
   * Triggered when template view is about to be entered
   * Determine whether we adding or editing a record
   * based on any supplied navigation parameters
   *
   * @public
   * @method ionViewWillEnter
   * @return {None}
   */
  ionViewWillEnter() : void
  {
    this.resetFields();

    if(this.NP.get("record"))
    {
      this.isEdited      = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle     = 'Valider l\'utilisateur';
      this.userTelDisplay = "0" + (this.userTel).substring(5, 7) + " " + (this.userTel).substring(7, 9) + " " + (this.userTel).substring(9, 11) + " " + (this.userTel).substring(11, (this.userTel).length);
      this.nbValidations = 1;
    }
    else
    {
      this.isEdited      = false;
      //this.pageTitle     = 'Create entry';
    }
  }




  /**
   * Assign the navigation retrieved data to properties
   * used as models on the page's HTML form
   *
   * @public
   * @method selectEntry
   * @param item 		{any} 			Navigation data
   * @return {None}
   */
  selectEntry(item : any) : void
  {
    this.userFirstName        = item.firstname;
    this.userLastName         = item.lastname;
    this.userEmail            = item.email;
    this.userTel              = item.tel;
    this.userNumeroTable      = item.numero_table;
    this.userNbPlaces         = item.nb_places;
    this.userValidation       = item.validation;
    this.recordID             = item.id;
  }



  /**
   * Update an existing record that has been edited in the page's HTML form
   * Use angular's http post method to submit the record data
   * to our remote PHP script
   *
   * @public
   * @method updateEntry
   * @param firstname 			{String} 	firstname value from form field
   * @param lastname 	{String} 			lastname value from form field
   * @return {None}
   */
  updateEntry(firstname : string, lastname : string, validation : number, tel : string) : void
  {
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
      options 	: any		= { "key" : "update", "firstname" : firstname, "lastname" : lastname, "validation" : validation, "tel" : tel},
      url       : any      	= this.baseURI + "manage-data.php";

    this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data =>
        {
          // If the request was successful notify the user
          this.hideForm  =  true;
          this.presentAlertConfirm(this.nbValidations + ` place(s) validée(s)`);
          this.navCtrl.push('HomePage');
        },
        (error : any) =>
        {
          this.presentAlert('Something went wrong!');
        });
  }



  /**
   * Handle data submitted from the page's HTML form
   * Determine whether we are adding a new record or amending an
   * existing record
   *
   * @public
   * @method saveEntry
   * @return {None}
   */
  saveEntry() : void
  {
    let firstname          : string   = this.form.controls["firstname"].value,
      lastname   :          string    = this.form.controls["lastname"].value,
      validation :          number    = this.form.controls["validation"].value + this.nbValidations,
      nb_places :           number    = this.form.controls["nb_places"].value,
      //heure_validation   : string     = this.getDateTime(),
      tel :                string     = this.form.controls["tel"].value;

    console.log(tel);

    if(validation > nb_places){
      this.presentAlert('Les places disponibles pour ce QR Code ont déjà été validées');
    }
    else{
      if(this.isEdited)
      {
        this.updateEntry(firstname, lastname, validation, tel);
      }
      else
      {
        this.updateEntry(firstname, lastname, validation, tel);
        //this.createEntry(firstname, lastname, validation, heure_validation);
      }
    }
  }




  /**
   * Clear values in the page's HTML form fields
   *
   * @public
   * @method resetFields
   * @return {None}
   */
  resetFields() : void
  {
    this.userFirstName           = "";
    this.userLastName    = "";
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
   * Adding/removing validations through +/- buttons in the addUser.html page
   *
   * @public
   * @method addValidation / removeValidation
   * @return {None}
   */  

  addValidation() : void{
    if((this.userValidation + this.nbValidations) < this.userNbPlaces)
      this.nbValidations = this.nbValidations + 1;
  }

  removeValidation(): void{
    if(this.nbValidations > 1){
      this.nbValidations = this.nbValidations - 1;
    }
  }

  goQrCard(firstname: string, lastname: string, tel: string) : void{
    let param : string[] = [firstname, lastname, tel];
    this.navCtrl.push('QrCardPage', param);
  }
  
  /**
   * Update an existing record that has been edited in the page's HTML form
   * Use angular's http post method to submit the record data
   * to our remote PHP script
   *
   * @public
   * @method sendToPrint
   * @return {None}
   */
  /*
  sendToPrint(tel: string) : void
  {
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
      options 	: any		= { "key" : "print", "tel" : tel},
      url       : any      	= this.baseURI + "manage-data.php";

    this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data =>
        {
          this.presentAlertConfirm('Impression réussie !');
        },
        (error : any) =>
        {
          this.presentAlert('Something went wrong!');
        });
  }*/

}
