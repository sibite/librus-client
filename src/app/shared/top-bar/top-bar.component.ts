import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService, SyncStateType } from 'src/app/store/store.service';

const syncTexts = {
  offline: 'Tryb offline',
  syncing: 'Synchronizowanie',
  error: 'Błąd synchronizacji',
  uptodate: 'Zakończono synchronizację'
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopbarComponent implements OnInit, OnDestroy {
  @Input() uiTitle: string;
  @Input() appIcon: string;
  @Input() showSyncState = true;
  @Output() onButtonClick = new EventEmitter();

  public syncState: string = 'none';
  private syncMode = 0;
  public syncText: string;

  private syncSub: Subscription;

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.handleNewState(this.storeService.syncState);
    this.syncSub = this.storeService.syncStateSubject.subscribe(
      state => {
        this.handleNewState(state);
      }
    );
  }

  ngOnDestroy() {
    this.syncSub.unsubscribe();
  }

  handleNewState(state: SyncStateType) {
    console.log('sync state:', state);

    if (state.offline) {
      this.syncState = 'offline';
    } else if (state.syncing) {
      this.syncState = 'syncing';
    } else if (state.error) {
      this.syncState = 'error';
    } else if (this.syncState == 'syncing' || this.syncState == 'uptodate'){
      this.syncState = 'uptodate';
    } else {
      this.syncState = 'none';
    }
    this.syncText = syncTexts[this.syncState];
  }

}
