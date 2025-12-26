import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionsComponent } from './promotions.component';
import { WhatsappCampaignComponent } from './whatsapp-campaign/whatsapp-campaign.component';

const routes: Routes = [
    {
        path: '',
        component: PromotionsComponent,
        children: [
            {
                path: 'whatsapp',
                component: WhatsappCampaignComponent
            },
            { path: '', redirectTo: 'whatsapp', pathMatch: 'full' },
            { path: '**', redirectTo: 'whatsapp', pathMatch: 'full' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PromotionsRoutingModule { }
