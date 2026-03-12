import { DemandPaymentComponent } from './demand/demand-payment/demand-payment.component';
import { Routes } from '@angular/router';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertySearchComponent } from './property-search/property-search.component';
import { PropertyEntryComponent } from './property-entry/property-entry.component';
import { QuickAddPropertyComponent } from './quick-add-property/quick-add-property.component';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { DemandListComponent } from './demand/demand-list/demand-list.component';
import { DemandTransactionsComponent } from './demand/demand-transactions/demand-transactions.component';
import { ApprovalHistoryComponent } from './approval-history/approval-history.component';
import { AddUpdateDemandAmountComponent } from './demand/add-update-demand-amount/add-update-demand-amount.component';



export default [
    { path: 'quick-add-property', component: QuickAddPropertyComponent },
    { path: 'property-search', component: PropertySearchComponent },
    { path: 'detail/:propertyId', component: PropertyDetailComponent },
    { path: 'approval-list', component: ApprovalListComponent },
    { path: 'property-entry/:propertyId', component: PropertyEntryComponent },
    { path: 'property-demand-list/:propertyId', component: DemandListComponent },
    { path: 'property-payment/:propertyId/:demandId', component: DemandPaymentComponent },
    { path: 'property-transactions/:propertyId/:demandId', component: DemandTransactionsComponent },
    { path: 'approval-history/:propertyId', component: ApprovalHistoryComponent },
    { path: 'add-demand/:propertyId', component: AddUpdateDemandAmountComponent },

] as Routes;