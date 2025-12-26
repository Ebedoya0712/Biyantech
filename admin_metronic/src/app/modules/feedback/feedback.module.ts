import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CKEditorModule } from 'ckeditor4-angular';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';

@NgModule({
    declarations: [
        FeedbackComponent,
        SendFeedbackComponent
    ],
    imports: [
        CommonModule,
        FeedbackRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        InlineSVGModule,
        CKEditorModule
    ]
})
export class FeedbackModule { }
