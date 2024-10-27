import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),  // Take the first value emitted by authState
      map(user => {
        if (user) {
          return true;  // Allow access if the user is authenticated
        } else {
          this.router.navigate(['/login']);  // Redirect to login if not authenticated
          return false;
        }
      })
    );
  }
}
