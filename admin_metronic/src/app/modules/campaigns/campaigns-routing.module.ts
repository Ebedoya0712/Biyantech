import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignsComponent } from './campaigns.component';
import { EmailCampaignComponent } from './email-campaign/email-campaign.component';

const routes: Routes = [
    {
        path: '',
        component: CampaignsComponent,
        children: [
            {
                path: 'email',
                component: EmailCampaignComponent
            },
            { path: '', redirectTo: 'email', pathMatch: 'full' },
            { path: '**', redirectTo: 'email', pathMatch: 'full' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CampaignsRoutingModule { }
