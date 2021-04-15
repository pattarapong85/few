import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';

@Injectable()
export class Globals {
    env = environment;
    showHeader: boolean = true;
    userName: string = "";
    token : string = "";
    userInfo : User;
    empInfo = {};
    headInfo = {};
    menuType = [];
    submenu = [];
    userDropdown = [];
    project : string = "FEW";
}