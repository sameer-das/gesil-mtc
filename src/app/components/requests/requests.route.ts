import { Routes } from "@angular/router";
import { MyRequestsComponent } from "./my-requests/my-requests.component";
import { NeedMyAttentionComponent } from "./need-my-attention/need-my-attention.component";
import { RequestDetailsComponent } from "./request-details/request-details.component";

export default [
    {
        path: 'my-requests',
        component: MyRequestsComponent
    },
    {
        path: 'pending-with-me',
        component: NeedMyAttentionComponent
    },
    {
        path:'', redirectTo: 'my-requests', pathMatch: 'full'
    },
    {
        path: 'request-details/:requestId', 
        component: RequestDetailsComponent
    }
] as Routes;