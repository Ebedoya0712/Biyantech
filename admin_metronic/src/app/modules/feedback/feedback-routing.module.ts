import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackComponent } from './feedback.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';

const routes: Routes = [
    {
        path: '',
        component: FeedbackComponent,
        children: [
            {
                path: 'send',
                component: SendFeedbackComponent
            },
            { path: '', redirectTo: 'send', pathMatch: 'full' },
            { path: '**', redirectTo: 'send', pathMatch: 'full' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeedbackRoutingModule { }
