import { HttpContextToken } from "@angular/common/http";

export const NO_LOADER = new HttpContextToken<boolean>(() => true);