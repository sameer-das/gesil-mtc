import { AbstractControl, ValidationErrors } from "@angular/forms";
import { map, Observable, of, Subject, takeUntil } from "rxjs";
import { OwnerDetail } from "../../../models/property-owner.model";
import { APIResponse } from "../../../models/user.model";
import { OwnerServiceService } from "../../../services/owner-service.service";
import { Signal } from "@angular/core";

export function uniqueAadharValidator(ownerService: OwnerServiceService, $destroy: Subject<null>, editMode: Signal<boolean>, currentAadhar: Signal<string | undefined>) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        // console.log(editMode(), currentAadhar());
        if (control.value.length === 12) {
            // In Edit mode if the aadhar no is equal to current saved aadhar then no need to check the 
            // unique valu in DB

            if (editMode() && currentAadhar() === control.value) {
                return of(null);
            }

            return ownerService.searchOwner('aadhar', control.value).pipe(
                takeUntil($destroy),
                map((resp: APIResponse<OwnerDetail[]>) => {
                    if (resp.data.length > 0) {
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