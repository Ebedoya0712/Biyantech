import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CKEditorModule } from 'ckeditor4-angular';

import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CampaignsComponent } from './campaigns.component';
import { EmailCampaignComponent } from './email-campaign/email-campaign.component';

@NgModule({
    declarations: [
        CampaignsComponent,
        EmailCampaignComponent
    ],
    imports: [
        CommonModule,
        CampaignsRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        InlineSVGModule,
        CKEditorModule
    ]
})
export class CampaignsModule { }
