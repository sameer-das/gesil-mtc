import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NO_LOADER } from '../httpContexts';
import { LoaderService } from '../loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const noLoader = req.context.get(NO_LOADER)
  
  if(!noLoader) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
