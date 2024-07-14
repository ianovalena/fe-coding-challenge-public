import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {ProductsModule} from "./modules/products/products.module";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ProductsModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
