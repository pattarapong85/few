import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';
import { StorageService } from 'ngx-webstorage-service';
import { Globals } from 'src/app/common/globals';

@Injectable()
export class LocalStorageService {
     STORAGE_KEY = 'GLOBAL_PARAM';
     anotherTodolist = [];
     constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private global: Globals) { }

     public setLocalStorage(global: Globals): void {
          this.storage.set(this.STORAGE_KEY, global);
     }

     public getLocalStorage(): Globals {
          let g = this.storage.get(this.STORAGE_KEY);
          if (!g) {
               g = this.global;
          }
          return g;
     }

     public deleteLocalStorage(): void {
          this.storage.remove(this.STORAGE_KEY);
     }
}