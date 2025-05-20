import { Component, OnInit } from '@angular/core';
import { CouponService } from '../service/coupon.service';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent implements OnInit {

  COUPONS:any = [];
  search:any = null;
  state:any = 0;

  isLoading:any;
  constructor(
    public couponService: CouponService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.couponService.isLoading$;
    this.listCoupons();
  }

  listCoupons(){
    this.couponService.listCoupon(this.search,this.state).subscribe((resp:any) => {
      console.log(resp);
      this.COUPONS = resp.coupons.data;
    })
  }

  deleteCoupon(COUPON:any){

  }

}
