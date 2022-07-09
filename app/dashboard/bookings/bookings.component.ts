import { Component, OnInit } from '@angular/core';
import { Bookings } from 'src/app/models/bookings.model';
import { BookingsService } from 'src/app/services/bookings.service';
import { Router } from '@angular/router';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  show: boolean;
  email$ =  sessionStorage.getItem('email');
  bookings$: Bookings[] = [];
  showMe:boolean=false;

  constructor(private bookingsService: BookingsService, 
    public router: Router) { }

  ngOnInit() {

  //////////////////////////////

  this.invokeStripe();

  /////////////////////////////
    this.checkLogin();
    this.getBookingById();
    
  }

  /////////////////////////////////////////////////////



    makePayment(amount: any) {
      this.showMe = !this.showMe
      const paymentHandler = (<any>window).StripeCheckout.configure({
        key:
          'pk_test_51JzaERSCKKUCZTpyRjqUXSC9A64pH4lOmSKTozgBf3Us7ahy2BUQPuym0gMDaZBQypJbb2aAQ5HAg5bWDgqTHvcK00BlX0Sw1a',
  
        locale: 'auto',
        token: function (stripeToken: any) {
          console.log(stripeToken.card);
          alert('Amount Successfully paid');
        },
      });
  
      paymentHandler.open({
        name: 'Car Parking',
        description: 'Slot Booking',
        amount: amount * 100,
        currency: 'inr'
      });
    }

  
    invokeStripe() {
      if(!window.document.getElementById('stripe-script')) {
        const script = window.document.createElement('script');
        script.id = 'stripe-script';
        script.type = 'text/javascript';
        script.src = 'https://checkout.stripe.com/checkout.js';
        window.document.body.appendChild(script);
      }
    }
  
  ///////////////////////////////////////////////////////

  getBookingById(){
    return this.bookingsService.getBookings(this.email$)
    .subscribe(data => {this.bookings$ = data, this.checkBookingFn();})
  }

  endBooking(bookingid){
    return this.bookingsService.endBooking(bookingid)
    .subscribe((data:{}) => {
      alert('Checked Out Successfully');
      location.reload();
      this.router.navigate(['dashboard/bookings'])
    })
  }
  checkBookingFn(){
    console.log()
    if (this.bookings$.length == 0){
      this.show = true
    }
    else{
      this.show = false
    }
  }

  checkLogin(){
    if (sessionStorage.length == 0){
      this.router.navigate(['login']);
    }
  }

}
