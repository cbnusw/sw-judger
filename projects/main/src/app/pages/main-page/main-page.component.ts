import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'sw-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(public auth: AuthService,
              public layout: LayoutService) {
  }

  ngOnInit(): void {

  }
}
