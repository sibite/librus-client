import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewService } from '../shared/view.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  showAverages = new FormControl(this.viewService.showAverages);
  theme = new FormControl(this.viewService.getLocalThemePreference());

  constructor(
    public viewService: ViewService,
    private location:Location
  ) { }

  ngOnInit(): void {
    this.theme.valueChanges.subscribe(value => {
      this.viewService.setLocalThemePreference(value);
      this.viewService.refreshTheme();
    })

    this.showAverages.valueChanges.subscribe(value => {
      this.viewService.showAverages = value;
    })
  }

  onBack() {
    this.location.back();
  }

}
