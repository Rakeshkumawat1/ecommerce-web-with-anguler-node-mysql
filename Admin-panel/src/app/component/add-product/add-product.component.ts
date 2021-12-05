import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  addProductForm: FormGroup;
  addProductMessage: any;

  constructor(private fb:FormBuilder,
              private productService: ProductService) { 
                this.addProductForm = fb.group({
                  title: ['', [Validators.required, Validators.minLength(1)]],
                  image: ['', [Validators.required, Validators.minLength(1)]],
                  images: ['', [Validators.required, Validators.minLength(1)]],
                  description: ['', [Validators.required, Validators.minLength(1)]],
                  price: ['', [Validators.required, Validators.minLength(1)]],
                  quantity: ['', [Validators.required, Validators.minLength(1)]],
                  short_desc: ['', [Validators.required, Validators.minLength(1)]],
                });
              }
          
  get formControls(){
    return this.addProductForm.controls;
  }

  ngOnInit(): void {
  }

  addProduct(){
    if(this.addProductForm.invalid){
      return;
    }
    this.productService.addProduct({...this.addProductForm.value}).subscribe((response:{ message: string}) =>{
      this.addProductMessage = response.message;
    });
    this.addProductForm.reset();
  }

}
