import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingServiceService {

  public handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occured:', error.error.message)
    } else {
      console.error(
        `Backend returned code $(error.status)` +
        `body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later'))
  }
}
