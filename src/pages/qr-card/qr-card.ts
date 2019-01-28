import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Printer, PrintOptions } from '@ionic-native/printer';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { File } from '@ionic-native/file';

import { HomePage } from '../home/home';
import { cordovaWarn, Cordova } from '@ionic-native/core';
declare let cordova : any;

@IonicPage()
@Component({
  selector: 'page-qr-card',
  templateUrl: 'qr-card.html'
})
export class QrCardPage {

  public firstname : string;
  public lastname : string;
  public tel : string = "";

  public objPrintersAll : Array<any>;

  letterObj = {
    to: '',
    from: '',
    text: ''
  }
  pdfObj = null;

  // Initialise module classes
  constructor(public navCtrl    : NavController,
              public http       : HttpClient,
              public NP         : NavParams,
              public alertCtrl  : AlertController,
              public printer   : Printer,
              private file: File, 
              private plt: Platform)
  {

  }

  ionViewWillEnter() : void
  {
    this.firstname = this.NP.data[0];
    this.lastname = this.NP.data[1];
    this.tel = this.NP.data[2];
  }

  generatePdf(){
    const div = document.getElementById("maDiv");
    const options = {background:"white",height :div.clientHeight , width : div.clientWidth  };
    html2canvas(div,options).then((canvas)=>{
      //Initialize JSPDF
      var doc = new jsPDF("p","mm","a4");
      //Converting canvas to Image
      let imgData = canvas.toDataURL("image/PNG");
      //Add image Canvas to PDF
      doc.addImage(imgData, 'PNG', 20,20 );
      
      let pdfOutput = doc.output();
      // using ArrayBuffer will allow you to put image inside PDF
      let buffer = new ArrayBuffer(pdfOutput.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < pdfOutput.length; i++) {
          array[i] = pdfOutput.charCodeAt(i);
      }
      //This is where the PDF file will stored , you can change it as you like
      // for more information please visit https://ionicframework.com/docs/native/file/
      const directory = this.file.externalApplicationStorageDirectory ;

      //Name of pdf
      const fileName = "badge.pdf";
      
      //Writing File to Device
      this.file.writeFile(directory,fileName,buffer)
      .then((success)=> console.log("File created Succesfully" + JSON.stringify(success)))
      .catch((error)=> console.log("Cannot Create File " +JSON.stringify(error)));
      
    });
  }

  getDataUrl(img :any) : string{
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL();
  }

  printQR() : void{
    if (this.plt.is('cordova')) {
      let options: PrintOptions = {
        name: 'MyDocument',
        printerId: 'QL-820NWB',
        duplex: true,
        landscape: true,
        grayscale: true
      };
      var image = new Image();
      image.src = "../../assets/imgs/tagby_logo.png";

    const div = document.getElementById("logo");
      html2canvas(div).then((canvas)=>{
      let imgData = canvas.toDataURL("base64/BMP");
      cordova.plugins.brotherPrinter.printViaSDK(this.getDataUrl(image), function(err){
        console.log("Error while printing");
      });
    });
    /*
          this.printer.isAvailable().then(onSuccess =>{
          this.printer.print("", options).then(onSuccess =>{
            alert("printing done successfully !");
          },onError=>{
            alert("Error while printing !");
          });
      }, onError =>{
        alert('Error : printing is unavailable on your device ');
      });
      */
    }
    else{
      window.print();
    }
  }



  printerSearch(){
    cordova.plugins.brotherPrinter.findNetworkPrinters(this.printerSearchSuccess, this.printerSearchError);
  }
  
  printerSearchSuccess(printers){
    this.objPrintersAll = printers
    this.printerSet();
  }
  
  printerSearchError(reason){
  alert('error: ' + reason);
  }
  
  printerSet(){
  cordova.plugins.brotherPrinter.setPrinter(this.objPrintersAll[0], this.printerSetSuccess, this.printerSetError);
  }
  
  printerSetSuccess(){
  var img = "base64string";
  cordova.plugins.brotherPrinter.printViaSDK(img, this.printerPrintSuccess);
  }
  
  printerSetError(reason){
  alert('error: ' + reason);
  }
  
  printerPrintSuccess(status){
  alert('Printed ' + status);
  }
}