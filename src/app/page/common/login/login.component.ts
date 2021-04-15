import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MiscComponent } from 'src/app/common/misc/misc.component';
import { AppComponent } from 'src/app/app.component';
import { AppService } from 'src/app/service/app.service';
import { UserService } from 'src/app/service/user.service';
import { MasterService } from 'src/app/service/master.service';
import { User } from 'src/app/models/user';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';
import { ComponentProject } from 'src/app/models/component-project';
import { Role } from 'src/app/models/role';
import { RoleAccess } from 'src/app/models/role-access';
import { RoleUser } from 'src/app/models/role-user';
import { System } from 'src/app/models/system';
import { Address } from 'src/app/models/address';
import * as firebase from 'firebase';






@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  showMsgError: boolean = false
  username: string = "";
  password: string = "";

  constructor(private app : AppComponent,
  private service: AppService,
  private userService: UserService,
  private masterService : MasterService,
  private cookieService : CookieService,
  private misc: MiscComponent,
  private router: Router) {}

  ngOnInit() {
    this.app.setShowHeader(false);
    let u = this.cookieService.get(this.service.USERNAME);
    if (u != null && u != "") {
      this.router.navigate(['/home'])
    }
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

script(){

  let dataArray =  [];
    var db = firebase.firestore();
    var batch = db.batch();

    /*let i = 0;
    dataArray.forEach(e => {
      let data = new Address;
      data.DT_NAME = e['district']; 
      data.AM_NAME = e['amphoe']; 
      data.PV_NAME = e['province']; 
      data.ZIPCODE = e['zipcode'].toString(); 
      data.FULLNAME = e['district'] + " "+e['amphoe']+ " " +e['province'] + " " +e['zipcode'];
      var docRef = db.collection("ADDRESS_ALL").doc(); //automatically generate unique id
      // var newRef = db.collection('ADDRESS_ALL').doc();
      //   batch.set(newRef, { name: 'New York City' });
      let mst = Object.assign({}, data);
      batch.set(docRef, mst);

      if((i % 500) == 0){
        if(i > 0){
          console.log("Commitng");
          batch.commit();

          batch = db.batch();
        }
      }

      i++;
      //this.service.create(data);
    });

    batch.commit();*/

    const batchArray = [];
    batchArray.push(db.batch());
    let operationCounter = 0;
    let batchIndex = 0;

    // dataArray.forEach(e => {
    //     //const documentData = documentSnapshot.data();

    //     // update document data here...
    //     let data = new Address;
    //   /*data.DT_NAME = e['district']; 
    //   data.AM_NAME = e['amphoe']; 
    //   data.PV_NAME = e['province']; 
    //   data.ZIPCODE = e['zipcode'].toString(); 
    //   data.FULLNAME = e['district'] + " "+e['amphoe']+ " " +e['province'] + " " +e['zipcode'];*/
    //   var docRef = db.collection("ADDRESS_ALL").doc(); //automatically generate unique id
    //   // var newRef = db.collection('ADDRESS_ALL').doc();
    //   //   batch.set(newRef, { name: 'New York City' });
    //   let mst = Object.assign({}, data);
    //   //batch.set(docRef, mst);
    //    // var docRef = db.collection("ADDRESS_ALL").doc(); 
    //     batchArray[batchIndex].update(docRef, mst);
    //     operationCounter++;

    //     if (operationCounter === 499) {
    //       batchArray.push(db.batch());
    //       batchIndex++;
    //       operationCounter = 0;
    //     }
    // });

    // batchArray.forEach(async batch => await batch.commit());

    /*this.subscriptions.push(this.masterService.getAddress().subscribe((res: ApiResponse) => {
      if (res.flag) {
        console.log(res.data);
        
      }
    },err => {
      console.log('error', err);
    }));*/

    this.service.getComponentList('fw').snapshotChanges().subscribe(response => {
      
      for (let item of response) {
        let e = <ComponentProject>item.payload.doc.data();
        e['KEY'] =item.payload.doc.id;
        //console.log(e.COMPONENT_CD);
        

        // let roleacc: RoleAccess = new RoleAccess();
        // roleacc.COMPONENT_CD = e.COMPONENT_CD;
        // roleacc.ROLE_CD = 'ADMIN';
        // roleacc.HEAD_CD = 'HOME';
        // roleacc.PROJECT = 'FEW';
        // this.userService.createRoleAccess(roleacc);
      }
  }, error => {
    console.log("ERROR",error);
    this.misc.newMessage('e', 'เกิดข้อผิดพลาด', 'ระบบผิดพลาดบางอย่าง');
  });

}

  login() {
    this.misc.progressSpinner(true);
    let globals = this.service.getGlobals();
      let user = new User;
      user.USERNAME = this.username;
      user.PASSWORD = this.password;
      this.userService.getOneUser(user).subscribe(u => {
        if(u != undefined){
          let localStorage = this.service.localStorageService();
          globals.token = u.USERNAME;
          localStorage.setLocalStorage(globals);
          let  timeOuts : number = 24 * 60 * 60 * 1000;
          this.cookieService.set(this.service.USERNAME,u.USERNAME,timeOuts);
          this.cookieService.set(this.service.HEAD,u.HEAD_CD,timeOuts);
          this.cookieService.set(this.service.PROJECT,'FEW',timeOuts);
          this.router.navigate(['/home']);
        }
        this.misc.progressSpinner(false);
      });
    this.misc.progressSpinner(false);
  }
}
