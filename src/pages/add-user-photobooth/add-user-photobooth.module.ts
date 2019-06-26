import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUserPhotobooth } from './add-user-photobooth';

@NgModule({
  declarations: [
    AddUserPhotobooth
  ],
  imports: [
    IonicPageModule.forChild(AddUserPhotobooth),
  ]
})
export class HomePageModule {}
