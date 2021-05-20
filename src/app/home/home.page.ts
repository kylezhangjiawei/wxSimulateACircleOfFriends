import { Component , OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalsComponent } from "./modals/modals.component";
import VConsole from 'vconsole';
import * as XLSX from 'xlsx';



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
export class HomePage implements OnInit{

    fileDatas:any;
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

  /* 上传文件 */
  upLoad(evt: any){
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.fileDatas = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
      console.log(this.fileDatas)
    };
    reader.readAsBinaryString(target.files[0]);
    console.log(this.fileDatas)
  }

}
