import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environment/environment.development';

export const configInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.apiUrl;
  const apiReq = req.clone({ url: `${apiUrl}/${req.url}` });
  return next(apiReq);
};
