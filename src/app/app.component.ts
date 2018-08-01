import { Component, OnInit } from '@angular/core';
import { TestService } from './core/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  constructor(public service: TestService) {
  }

  ngOnInit(): void {
    this.service.log('Ciao');
  }


}
