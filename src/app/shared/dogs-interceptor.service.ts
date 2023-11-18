import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import mockDogs from '../mockdogs.json'
import { Dog } from './model';
@Injectable({
  providedIn: 'root'
})
export class DogsInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<Dog[]>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('dogs')) {
      return of(new HttpResponse({ status: 200, body: mockDogs }))
    }
    return next.handle(req)
  }
}
