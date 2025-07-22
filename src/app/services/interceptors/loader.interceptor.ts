import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../loader.service';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  // console.log(req.url)
  let urlFound = false;
  try {
    const url = new URL(req.url);
    urlFound = environment.NO_LOADER_URLS.some(u => url.pathname.toLowerCase().includes(u.toLowerCase()));
  } catch(e) {
    // ignore
  }
  
  // Show loader only if current URL is not part of NO_LOADER_URLS
  if(!urlFound) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
