import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { SHOW_LOADER } from '../httpContexts';
import { LoaderService } from '../loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const showLoader = req.context.get(SHOW_LOADER)

  if(showLoader) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
