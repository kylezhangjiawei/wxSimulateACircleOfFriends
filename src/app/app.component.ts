import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { LoadingsService } from "./loadings.service";
import VConsole from 'vconsole';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isLoading:boolean;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public loading:LoadingsService
  ) {
    this.initializeApp();
    this.loading.getActiveTheme().subscribe(val =>{
      // console.log(val);
      this.isLoading = val;
    })
    // const vconsole = new VConsole();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
