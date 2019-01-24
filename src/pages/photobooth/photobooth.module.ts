import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotoboothPage } from './photobooth';

@NgModule({
  declarations: [
    PhotoboothPage
  ],
  imports: [
    IonicPageModule.forChild(PhotoboothPage),
  ]
})
export class HomePageModule {}
