import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrCardPage } from './qr-card';
import {NgxQRCodeModule} from "ngx-qrcode2";

@NgModule({
  declarations: [
    QrCardPage
  ],
  imports: [
    IonicPageModule.forChild(QrCardPage),
    NgxQRCodeModule
  ],
})
export class AddUserPageModule {}
