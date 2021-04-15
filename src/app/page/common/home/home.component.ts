import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Subscription } from 'rxjs';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { AppComponent } from 'src/app/app.component';
import { AppService } from 'src/app/service/app.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private subscriptions: Subscription[] = [];

    constructor(private app: AppComponent,
    private cookieService : CookieService,
    private service: AppService,
    private misc: MiscComponent) { }

  items: MenuItem[];

  ngOnInit() {
      this.app.setShowHeader(true);
  }

}
