import { Component, OnInit } from '@angular/core';
import { CartService } from '../../tienda-guest/service/cart.service';

declare function alertSuccess([]):any;
declare function alertDanger([]):any;
@Component({
  selector: 'app-list-carts',
  templateUrl: './list-carts.component.html',
  styleUrls: ['./list-carts.component.css']
})
export class ListCartsComponent implements OnInit{

  listCarts:any = [];
  totalSum:number = 0;
  code:any = null;
  constructor(
    public cartService: CartService
  ) {
    
  }
  ngOnInit(): void {
    this.cartService.currentData$.subscribe((resp:any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalSum = this.listCarts.reduce((sum:number, item:any) => sum + item.total,0);
    })
  }

  getNameCampaing(type:number){
    let Name = "";
    switch (type) {
      case 1:
        Name = "CAMPAÑA NORMAL"
        break;
      case 2:
        Name = "CAMPAÑA FLASH"
        break;
      case 3:
        Name = "CAMPAÑA BANNER"
        break;
    
      default:
        break;
    }

    return Name;
  }

  removeItem(cart:any){
    this.cartService.deleteCart(cart.id).subscribe((resp:any) => {
      console.log(resp);
      alertSuccess("EL ITEM SE A ELIMINADO CORRECTAMENTE ");
      this.cartService.removeItemCart(cart);
    })
  }

  applyCupon(){
    if(!this.code){
      alertDanger("NECESITAS INGRESAR UN CUPON");
      return;
    }
    let data = {
      code: this.code,
    }
    this.cartService.applyCupon(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alertDanger(resp.message_text);
      }else{
        this.cartService.resetCart();
        setTimeout(() => {
          resp.carts.data.forEach((cart:any) => {
            this.cartService.addCart(cart);
          });
        }, 50);
        alertSuccess("EL CUPON SE HA REGISTRADO CORRECTAMENTE");
      }
    })
  }
}

