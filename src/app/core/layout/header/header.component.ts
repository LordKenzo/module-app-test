import { ApiService } from '../../services/api.service';
import { TestService } from '../../test.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private testService: TestService, private apiService: ApiService) {
    console.log('Costruisco lo header component', Math.random());
  }

  ngOnInit() {
    this.testService.log('/user');
    this.apiService.get('/rentals').subscribe(data => console.log(data), err => console.error(err));
  }
}
