import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

    user:any = null;
    constructor(
      public authService: AuthService,
    ){

    }

    ngOnInit(): void {
      console.log(this.authService.user);
      this.user = this.authService.user;
    }

    logout(){
      this.authService.logout();
    }
}
