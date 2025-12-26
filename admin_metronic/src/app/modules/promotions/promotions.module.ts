import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionsComponent } from './promotions.component';
import { WhatsappCampaignComponent } from './whatsapp-campaign/whatsapp-campaign.component';

@NgModule({
    declarations: [
        PromotionsComponent,
        WhatsappCampaignComponent
    ],
    imports: [
        CommonModule,
        PromotionsRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        InlineSVGModule
    ]
})
export class PromotionsModule { }
