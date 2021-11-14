import { Injectable } from "@angular/core";
import { MeType } from "./models/me.model";
import { SynergiaAccountType } from "./models/synergia-accounts.model";

export type StoreData = {
  account?: SynergiaAccountType,
  me?: MeType
};

@Injectable({providedIn: 'root'})
export class StoreService {
  data: StoreData = {};

  constructor() {}

  setUser(user) {
    this.data.account = user.account;
    this.data.me = user.me;
  }

  getData() {
    return this.data;
  }
}
