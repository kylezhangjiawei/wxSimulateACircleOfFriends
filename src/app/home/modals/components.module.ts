import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ModalsComponent } from "./modals.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule.forRoot(),
    ],
    declarations: [
        ModalsComponent
    ],
    exports: [
        ModalsComponent
    ],
})
export class ComponentsModule { }