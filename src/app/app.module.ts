import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Printer, PrintOptions } from '@ionic-native/printer';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {NgxQRCodeModule} from "ngx-qrcode2";
import {HomePageModule} from "../pages/home/home.module";


@NgModule({
  declarations: [
    MyApp
    //HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    NgxQRCodeModule,
    HomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen, Camera, FileTransfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Printer,
    File
  ]
})
export class AppModule {}
