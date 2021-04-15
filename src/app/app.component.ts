import { Component ,ChangeDetectorRef } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { Router, Route } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'few';
  showHeader = this.app.getGlobals().showHeader;

  constructor(
    private router: Router,
    private app: AppService,
    private changeDetector: ChangeDetectorRef) { }

    getGlobals() {
      return this.app.getGlobals();
    }

    ngOnInit() {
      this.printpath('', this.router.config);
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }
  
    public setShowHeader(isShow) {
      this.showHeader = isShow;
    }


    printpath(parent: String, config: Route[]) {
      for (let i = 0; i < config.length; i++) {
        const route = config[i];
        if (route.children) {
          const currentPath = route.path ? parent + '/' + route.path : parent;
          this.printpath(currentPath, route.children);
        }
      }
    }
}
