import { CoreModule } from './core.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() { }

  log(msg: string) {
    console.log(msg);
  }
}
