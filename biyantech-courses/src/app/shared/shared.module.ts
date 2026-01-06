import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SafePipe } from './pipes/safe.pipe';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SafePipe
  ],
})
export class SharedModule { }
