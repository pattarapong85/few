import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppService } from 'src/app/service/app.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private app: AppService, private router: Router) { };
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let global = this.app.localStorageService().getLocalStorage();
        if (global.token == '') {
            global = this.app.getGlobals();
        }
        
        req = req.clone({
            setHeaders: {
                'Authorization': global.token,
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status == 401 || err.status == 403) {
                    //this.app.localStorageService().deleteLocalStorage();
                    this.router.navigate(['/login'])
                } else {
                    return throwError(err);
                }
            })
        );
    }
}