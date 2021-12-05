import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/service/product.service';
import { CheckCategoryService } from 'src/app/validators/check-category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  addCategoryForm: FormGroup;
  addCategoryMessage: any  ;

  constructor(private fb: FormBuilder,
              private checkCategoryService : CheckCategoryService,
              private productService: ProductService) { 

                this.addCategoryForm = fb.group({
                  cname: ['', [Validators.required, Validators.minLength(1)],
                  this.checkCategoryService.categoryValidate()]
                });
              }

  get formControls(){
    return this.addCategoryForm.controls;
  }

  ngOnInit(): void {
    
  }

  addCategory(){
    if(this.addCategoryForm.invalid){
      return;
    }
    this.productService.addCategory({...this.addCategoryForm.value}).subscribe((response:{ message: string} ) =>{
      this.addCategoryMessage = response.message;
      // console.log(this.addCategoryMessage);
    });
    this.addCategoryForm.reset();
  }

}
