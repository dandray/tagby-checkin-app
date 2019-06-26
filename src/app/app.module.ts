import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Printer, PrintOptions } from '@ionic-native/printer';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {NgxQRCodeModule} from "ngx-qrcode2";
import {LoginPageModule} from "../pages/login/login.module";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { EmailComposer } from '@ionic-native/email-composer';
import { SMS } from '@ionic-native/sms';


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
    LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen, Camera, FileTransfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Printer,
    File,
    AndroidPermissions,
    SMS,
    EmailComposer
  ]
})
export class AppModule {}
