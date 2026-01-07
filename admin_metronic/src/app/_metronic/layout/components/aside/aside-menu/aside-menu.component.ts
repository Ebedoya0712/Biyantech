import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  user: any;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.user;
  }
}
