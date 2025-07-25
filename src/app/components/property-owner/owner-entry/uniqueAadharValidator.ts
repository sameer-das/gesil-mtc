import { AbstractControl, ValidationErrors } from "@angular/forms";
import { map, Observable, of, Subject, takeUntil } from "rxjs";
import { OwnerDetail } from "../../../models/property-owner.model";
import { APIResponse } from "../../../models/user.model";
import { OwnerServiceService } from "../../../services/owner-service.service";

export function uniqueAadharValidator (ownerService: OwnerServiceService, $destroy: Subject<null>){
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if(control.value.length === 12) {
            return ownerService.searchOwner('aadhar', control.value).pipe(
                takeUntil($destroy),
                map((resp: APIResponse<OwnerDetail[]>) => {
                    if(resp.data.length > 0) {
                        return { aadharAlreadyUsed: true, ownerId: resp.data[0].ownerId }
                    } else {
                        return null;
                    }
                })
            )
        } 
        else {
            return of(null)
        }
    }
}