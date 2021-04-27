import {Injectable} from '@angular/core';
import {Subject,BehaviorSubject} from 'rxjs';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingsService {
  public isLoading : BehaviorSubject<boolean>;


  constructor(public loadingController: LoadingController) {
    this.isLoading = new BehaviorSubject(false);
  }

  setActiveTheme(val) {
    this.isLoading.next(val);
  }


  getActiveTheme() {
    return this.isLoading.asObservable();
  }


}
