import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  /**
   * @name items
   * @type {Array}
   * @public
   * @description     Used to store returned PHP data
   */
  public items : Array<any> = [];

  public fields : Array<any> = [];

  public searchTerm = '';

  public searchTerm2 : '';

  public searchTerm3 : '';

  public searchTerm4 : '';


  //Variable permettant de voir ou pas les résultats de recherche
  public isVisible = false;


  /**
   * @name baseURI
   * @type {String}
   * @public
   * @description     Remote URI for retrieving data from and sending data to
   */
  private baseURI               : string  = "http://cdm.tag.by/mobileApp/";


  /**
   * @name hideContent
   * @type {Boolean}
   * @public
   * @description     Flag to hide the content upon successful completion of remote operation
   */
  public hideContent               : boolean = false;


  constructor(public navCtrl: NavController,
              public http   : HttpClient,
              public toastCtrl  : ToastController,
              private alertCtrl: AlertController)
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
          console.dir('load : ' + data);
          this.items = data;
        },
        (error : any) =>
        {
          console.dir(error);
        });
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
    //Si l'entrée envoyée contient 'empty', on sait qu'aucun des champs n'a été saisi
    if(JSON.stringify(param) == "{\"record\":\"empty\"}"){
      this.presentAlert("Veuillez saisir au minimum un prénom et un nom");
    }
    //Si l'entrée envoyée ne contient pas de user mais la valeur 0, on envoie une notification car il n'est pas en bdd
    else if(JSON.stringify(param) == "{\"record\":0}"){
      this.presentAlert("L'utilisateur n'existe pas dans la base de données");
    }
    //Si l'entrée envoyée est complètement vide, c'est qu'on a notre compteur à 2, il y a 2 invités qui correspondent à la recherche
    else if(JSON.stringify(param) == "{}"){
      this.presentAlert("Ce nom est lié à 2 utilisateurs en base de données : Merci d'entrer le numéro de tel");
    }
    //Si on a un seul user sélectionné par la recherche, on affiche la page de validation
    else{
      this.navCtrl.push('AddUserPage', param);
    }
  }


  search(mySearchTerm: any, mySearchTerm2 : any, mySearchTerm3 : any, mySearchTerm4 : any) : any {
    let id = 0;
    let count = 0;
    let numero_table = '';

    //On enlève les espaces des chaines de caractères saisies pour les 3 champs
    if(mySearchTerm == null){
      mySearchTerm = '';
    }
    else{
      mySearchTerm = mySearchTerm.replace(/\s/g, '');
    }
    if(mySearchTerm2 == null){
      mySearchTerm2 = '';
    }
    else{
      mySearchTerm2 = mySearchTerm2.replace(/\s/g, '');
    }
    if(mySearchTerm3 == null){
      mySearchTerm3 = '';
    }
    else{
      mySearchTerm3 = mySearchTerm3.replace(/\s/g, '');
    }
    if(mySearchTerm4 == null){
      mySearchTerm4 = '';
    }
    else{
      mySearchTerm4 = mySearchTerm4.replace(/\s/g, '');
    }

    //Si l'utilisateur n'a pas entré suffisamment de champs (soit nom ET prénom / Soit tel), on retourne 'empty'
    if((mySearchTerm2=='' && mySearchTerm3 == '') ||(mySearchTerm=='' && mySearchTerm3 == '')){
      return 'empty';
    }
    else{
      //On boucle sur les enregistrements de la base pour voir s'il y a une correspondance
      for(let i=0; i<this.items.length;i++){
        //On formate le numero de tel de la bdd pour qu'il corresponde au format tapé par l'hotesse
        let telBDD = "0" + this.items[i].tel.substring(5,this.items[i].tel.length);

        //Au cas où un numéro de table est entré par l'hotesse, on le prend en compte (et pas seulement le num de tel).
        if(mySearchTerm4!=''){
          numero_table = this.items[i].numero_table;

          if(telBDD==mySearchTerm3 && numero_table==mySearchTerm4){
            id = this.items[i];
            return id;
          }
        }
        //Si on a entré le numéro de téléphone mais pas de numéro de table, on ne s'occupe de rien d'autre, c'est lui qui nous envoie sur le user en question
        else if(telBDD==mySearchTerm3){
          id = this.items[i];
          return id;
        }
        
        //Si on a nom/prénom qui correspondent à une donnée, on enregistre la donnée en mémoire et on incrémente le compteur
        else if((this.items[i].firstname.toLowerCase()==mySearchTerm.toLowerCase()) && (this.items[i].lastname.toLowerCase()==mySearchTerm2.toLowerCase())){
          id = this.items[i];
          count++;
        }
      }
      //Si le compteur a été incrémenté, on va forcer l'entrée du numéro de téléphone en ne retournant rien ici
      if(count>1){
        //On ne retourne rien
        return ;
      }
      //Sinon, on va juste retourner la donnée enregistrée
      else{
        return id;
      }
    }
  }

  presentAlert(myMessage: string) {
    let alert = this.alertCtrl.create({
      title: 'Attention',
      message : myMessage,
      buttons: ['OK']
    });
    alert.present();
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
