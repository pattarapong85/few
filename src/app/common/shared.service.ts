import { Injectable, Output, EventEmitter } from '@angular/core'
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {
    @Output() fire: EventEmitter<any> = new EventEmitter();

    constructor() {}

    progressSpinner(show: boolean) {
        this.fire.emit(show);
    }

    getEmittedValue() {
        return this.fire;
    }
} 