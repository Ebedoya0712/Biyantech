import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { CartService } from 'src/app/modules/tienda-guest/service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

    user:any = null;
    constructor(
      public authService: AuthService,
      public cartService: CartService,
    ){

    }

    ngOnInit(): void {
      console.log(this.authService.user);
      this.user = this.authService.user;

      this.cartService.currentData$.subscribe((resp:any) => {
        console.log(resp);
      });
    }

    logout(){
      this.authService.logout();
    }
}
