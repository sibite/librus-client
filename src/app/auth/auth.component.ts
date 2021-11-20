import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ViewService } from '../shared/view.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  errorMessage = null;
  isSidemenuOpened = false;

  constructor(
    public viewService: ViewService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log(form);
  }

  onCloseSidemenu() {
    this.isSidemenuOpened = false;
  }

  onOpenSidemenu() {
    this.isSidemenuOpened = true;
  }

}
