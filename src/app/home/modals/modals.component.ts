import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import {ModalController} from '@ionic/angular';

interface wxDatas{
  month:number | string,
  day:number | string,
  url:string,
  title:string,
  imgUrl:string,
  content:string
}

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
})
export class ModalsComponent implements OnInit {

  public loadingIsOpen: any = false;

  wxArrayData:wxDatas[]=[{
    month:'',
    day:'',
    url:'',
    title:'',
    imgUrl:'',
    content:''
  }];

  constructor(
      public http:HttpClient,
      public loadingController: LoadingController,
      public toastController: ToastController,
      private modalController:ModalController
  ) { }

  ngOnInit() {}

  /* 获取URL内容 */
  getWXdata(){
    for(let i =0;i<this.wxArrayData.length;i++){
        this.getDatas(this.wxArrayData[i],i);
    }
    this.hiden();
    this.modalController.dismiss(this.wxArrayData);
  }

  getWXdata2(){
    for(let i =0;i<this.wxArrayData.length;i++){
      this.getTest(this.wxArrayData[i],i);
    }
    this.hiden();
    this.modalController.dismiss(this.wxArrayData);
  }

  getDatas(item,index):void{
    this.presentLoading();
    this.http.get('https://blankyi.com/zjw/',{params:{url:item.url}}).subscribe(res =>{
      if((res as any).success){
        this.wxArrayData[index].imgUrl=(res as any).cover;
        this.wxArrayData[index].content = (res as any).title;
        this.hiden();
        console.log(this.wxArrayData)
      }
    })
  }

  getTest(item,index){
    this.presentLoading();
    this.http.get('wxdata/',{params:{url:item.url}}).subscribe(res =>{
      if((res as any).success){
        this.wxArrayData[index].imgUrl=(res as any).cover;
        this.wxArrayData[index].content = (res as any).title;
        this.hiden();
        console.log(this.wxArrayData)
      }
    })
  }


  async presentLoading() {
    this.loadingIsOpen = true;
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: '正在加载...'
    }).then(e => {
      e.present().then(() => {
        if (!this.loadingIsOpen) {
          e.dismiss().then(() => console.log('about presenting'));
        }
      })
    })
  }

  async hiden() {
    this.loadingIsOpen = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  /* 添加新的数据 */
  add(){
    this.wxArrayData.push({
      month:'',
      day:'',
      url:'',
      title:'',
      imgUrl:'',
      content:''
    })
  }

  /* 删除数据 */
  delete(index){
    if(this.wxArrayData.length <= 1){
        this.presentToast()
    }else {
      this.wxArrayData.splice(index,1);
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '还删？只剩一条了朋友！',
      color:'medium',
      position:'top',
      duration: 2000
    });
    toast.present();
  }
}
