import { Component , OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalsComponent } from "./modals/modals.component";
import VConsole from 'vconsole';



  interface wxDatas{
  month:number | string,
  day:number | string,
  url:string,
  title:string,
  imgUrl:string,
  content:string
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  wxArrayData:wxDatas[];

  constructor(public modalController: ModalController) {}

  ngOnInit(){

  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalsComponent,
      cssClass: 'my-custom-class'
    });
     await modal.present();
    const {data} = await modal.onDidDismiss();
    this.wxArrayData = data;
  }

  reload() {
    location.reload();
  }

}
