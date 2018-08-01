import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getToken(): String {
    throw new Error('getToken To be implemented');
  }

  saveToken(token: String) {
    throw new Error('saveToken To be implemented');
  }

  deleteToken() {
    throw new Error('deleteToken To be implemented');
  }

  isValid() {
    throw new Error('isValid To be implemented');
  }

}
