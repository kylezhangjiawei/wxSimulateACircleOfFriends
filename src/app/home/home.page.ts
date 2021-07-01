import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ModalsComponent} from "./modals/modals.component";
import {HttpClient} from '@angular/common/http';
import {LoadingController} from '@ionic/angular';
import {ToastController} from '@ionic/angular';
import VConsole from 'vconsole';
import * as XLSX from 'xlsx';


interface wxDatas {
    month: number | string,
    day: number | string,
    url: string,
    title: string,
    imgUrl: string,
    content: string,
    type:string
}

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    wxArrayData: wxDatas[] = [];

    constructor(
        public modalController: ModalController,
        public http: HttpClient,
        public loadingController: LoadingController,
        public toastController: ToastController
    ) {
    }

    imgsrc: any;

    public loadingIsOpen: any = false;


    ngOnInit() {

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

    getImg() {
        this.getVideoBase64('https://finder.video.qq.com/251/20302/stodownload?X-snsvideoflag=xV1&adaptivelytrans=0&bizid=1023&dotrans=2&encfilekey=RBfjicXSHKCOONJnTbRmmlD8cOQPXE48ibovAcdLMbtr6fKSiaibtXzuAFLPFO2OibIvCYCicAXzdcWDNS4Qx5z7LlnJLYHuiciaAHd0sfLAg4fu9IgRKRypwwTe5eFmHZTJQeErhyQfZ2UmqVpuuwDibgjFZIqvpMXFcS4Wv0ayYM4ZBJFU&hy=SH&idx=1&m=6e4b83a28aa6b417e0d3dff6b02b5d04&scene=0&token=AxricY7RBHdW8WsKeGspMTTYce94VLibLGs3eWMMg79vNDgb9pcWiaCf2I6ayjJibficXCVhicm6T9Atw&taskid=0').then(res => {
            console.log(res)
            this.imgsrc = res;
        });
    }

    getVideoBase64(url) {
        return new Promise(function (resolve, reject) {
            let dataURL = '';
            let video: any = document.createElement("video");
            video.setAttribute('crossOrigin', 'anonymous');//处理跨域
            video.setAttribute('src', url);
            video.setAttribute('width', 400);
            video.setAttribute('height', 240);
            video.setAttribute('autoplay', 'autoplay');
            video.onloadeddata = (() => {

            })
            video.addEventListener('loadeddata', function () {
                let canvas = document.createElement("canvas")
                let width = video.width; //canvas的尺寸和图片一样
                let height = video.height;
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
                dataURL = canvas.toDataURL('image/jpeg'); //转换为base64
                resolve(dataURL);
            });
        })
    }

    reload() {
        location.reload();
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

    /* 上传文件并获取文件内容 */
     putFile(file) {
        console.log(file)
        let formDatas = new FormData();
        formDatas.append('file', file.target.files[0]);
        this.presentLoading();
        this.http.post('http://175.27.231.102:8080/zhangjiawei/interface/uploadInfo', formDatas).subscribe((res: any) => {
                this.hiden();
                console.log(res);
                let datas:any = JSON.parse(JSON.stringify(res.data));
                for(let item of datas){
                    item.date = item.date.split('-');
                }
                for(let i =0;i<datas.length;i++){
                    this.wxArrayData.unshift({
                        month:datas[i].date[1],
                        day:datas[i].date[2],
                        url:datas[i].url,
                        title:datas[i].title,
                        imgUrl:datas[i].type === 'video' ? datas[i].url:'',
                        content:datas[i].type === 'article' ? '':'泰享健康的视频',
                        type:datas[i].type
                    })
                }
                for(let i =0;i<this.wxArrayData.length;i++){
                    if(this.wxArrayData[i].type === 'article'){
                        this.getWXdata(this.wxArrayData[i],i)
                    }
                }
            }
        )
    }
/* 微信朋友圈获取内容 */
     getWXdata(item,index):any{
        this.http.get('http://175.27.231.102:8080/zhangjiawei/interface',{params:{url:item.url.replace(/^http:\/\//i, 'https://')}}).subscribe((res:any) =>{
            if(res.success){
                this.wxArrayData[index].imgUrl=res.cover;
                this.wxArrayData[index].content = res.title;
                }
            }
        )

    }
    getDatas(item,index){
        this.presentLoading();
        this.http.get('http://175.27.231.102:8080/zhangjiawei/interface',{params:{url:item.url}}).subscribe(res =>{
                if((res as any).success){
                    this.wxArrayData[index].imgUrl=(res as any).cover;
                    this.wxArrayData[index].content = (res as any).title;
                    this.hiden();
                }
            }
        )
    }

    /* 过滤时间 */
    filterTime(data:any,index:number){
        let arr:any = [];
        /* 如果大于0 */
        if(index ===0 || index === (this.wxArrayData.length-1)){
            return true;
        }else {
            for(let i=index;i<this.wxArrayData.length;i++){
                if(data.day === this.wxArrayData[--i].day || data.day === this.wxArrayData[--i].day){
                    return  false;
                }else {
                    return true;
                }
            }
        }

    }


}
