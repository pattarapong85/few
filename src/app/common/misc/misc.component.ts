import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { delay, async } from 'q';
import { SharedService } from 'src/app/common/shared.service';

@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.scss']
})
export class MiscComponent implements OnInit {

  progressSpinnerDlg: boolean = false;
  private severity = {'s':'success', 'i':'info', 'w':'warn', 'e':'error'};
  constructor(private messageService: MessageService, private ss: SharedService) { }

  ngOnInit() {
    this.ss.getEmittedValue().subscribe(item => this.progressSpinnerDlg = item);
  }

  public progressSpinner(show: boolean) {
    this.ss.progressSpinner(show);
  }

  // severity : ['s', 'i', 'w', 'e']
  public newMessage(sv, summaryTxt, detailTxt) {
    this.messageService.add({ severity: this.severity[sv], summary: summaryTxt, detail: detailTxt });
  }

  // key : [top-left : tl, top-center : tc, bottom-center : bc]
  public newMsgPosition(k, sv, summaryTxt, detailTxt) {
    this.messageService.add({key: k,  severity: this.severity[sv], summary: summaryTxt, detail: detailTxt });
  }

  public clearMessage(ms) {
    (async () => {
      await delay(ms);
      this.messageService.clear();
    })();
  }

}
