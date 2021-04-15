import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from 'src/app/common/globals';
import {ActivatedRoute} from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase,AngularFireList } from '@angular/fire/database';
import { User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';
import { RoleAccess } from 'src/app/models/role-access';
import { RoleUser } from 'src/app/models/role-user';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import {Resolve,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router'
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';



@Injectable({
  providedIn: 'root'
  })
export class UserService {

  private db_USERS = 'USERS';
  private db_ROLE = 'ROLE';
  private db_ROLE_ACCESS = 'ROLE_ACCESS';
  private db_ROLE_USER = 'ROLE_USER';
  private db_COMPONENT = 'COMPONENT';
 
  userRef: AngularFirestoreCollection<User> = null;
  roleRef: AngularFirestoreCollection<Role> = null;
  roleAccessRef: AngularFirestoreCollection<RoleAccess> = null;
  roleUserRef: AngularFirestoreCollection<RoleUser> = null;

  book : Observable<User | null>;
  booksCollection: AngularFirestoreCollection<User>;

  constructor(private http: HttpClient, 
    private route: ActivatedRoute,
    private globals: Globals,
    private fireDatabase : AngularFireDatabase,
    private firestore: AngularFirestore) { 

    this.userRef = firestore.collection(this.db_USERS);
    this.roleRef = firestore.collection(this.db_ROLE);
    this.roleAccessRef = firestore.collection(this.db_ROLE_ACCESS);
    this.roleUserRef = firestore.collection(this.db_ROLE_USER);
  }

  login(obj) {     
    return this.http.post(this.globals.env.apiBaseUrl + '/Login_ctrl/login', obj);
  }

  logout(obj) {
      return this.http.post(this.globals.env.apiBaseUrl + '/Login_ctrl/logout', obj);
  }
 
  createUser(data: User): void {
    this.userRef.add({...data});
  }

  createRole(data: Role): void {
    this.roleRef.add({...data});
  }

  createRoleAccess(data: RoleAccess): void {
    this.roleAccessRef.add({...data});
  }

  createRoleUser(data: RoleUser): void {
    this.roleUserRef.add({...data});
  }
 
  updateUser(key: string, value: any): Promise<void> {
      return this.userRef.doc(key).set(value,{merge: true});
  }

  updateRole(key: string, value: any): Promise<void> {
    return this.roleRef.doc(key).set(value,{merge: true});
  }

  updateRoleAccess(key: string, value: any): Promise<void> {
    return this.roleAccessRef.doc(key).set(value,{merge: true});
  }

  updateRoleUser(key: string, value: any): Promise<void> {
    return this.roleUserRef.doc(key).set(value,{merge: true});
  }
 
  deleteUser(key: string): Promise<void> {
    return this.userRef.doc(key).delete();
  }

  deleteRole(key: string): Promise<void> {
    return this.roleRef.doc(key).delete();
  }

  deleteRoleAccess(key: string): Promise<void> {
    return this.roleAccessRef.doc(key).delete();
  }

  deleteRoleUser(key: string): Promise<void> {
    return this.roleUserRef.doc(key).delete();
  }
 
  getUserList(headCd) {
    return  this.firestore.collectionGroup(this.db_USERS, ref => ref.where('HEAD_CD', '==',headCd));
  }

  getRoleList(headCd) {
    return  this.firestore.collectionGroup(this.db_ROLE, ref => ref.where('HEAD_CD', '==',headCd));
  }

  getRoleAccesstList(roleCode,headCode) {
    return this.roleAccessRef = this.firestore.collection("ROLE_ACCESS", ref => ref.where('ROLE_CD', '==', roleCode)
    .where("HEAD_CD","==",headCode).where("PROJECT","==","FEW"));
  }

  getRoleUserList(user,headcode) {
    return  this.firestore.collectionGroup(this.db_ROLE_USER, ref => ref.where('HEAD_CD', '==',headcode).where('USERNAME', '==',user));
  }
  
  getOneUser(user: User) {
    this.booksCollection = this.firestore.collection(this.db_USERS, ref => ref.where('USERNAME', '==', user.USERNAME).where('PASSWORD', '==', user.PASSWORD));
    let userReturn = this.booksCollection.valueChanges()
      .pipe(
        map(users => {
          const user = users[0];
          return user;
        })
      );

    return userReturn;
  }
  
  
 
  deleteAll() {
    this.userRef.get().subscribe(
      querySnapshot => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      },
      error => {
        console.log('Error: ', error);
      });
  } 
}
