import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New", "Second Hand", "Refurbished"]
  productForm !: FormGroup
  actionBtn: string = "Save"
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    })

    if (this.editData) {
      this.actionBtn = "Update"
      this.productForm.controls['productName'].setValue(this.editData.productName)
      this.productForm.controls['category'].setValue(this.editData.category)
      this.productForm.controls['freshness'].setValue(this.editData.freshness)
      this.productForm.controls['price'].setValue(this.editData.price)
      this.productForm.controls['date'].setValue(this.editData.date)
      this.productForm.controls['comment'].setValue(this.editData.comment)
    }
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.productService.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('Product has been saved')
            this.productForm.reset()
            this.dialogRef.close("save")
          },
          error: () => {
            alert('Error while adding the product')
          }
        })
      }
    } else {
      this.updateProduct()
    }
  }

  updateProduct() {
    this.productService.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next: (res) => {
        alert('Product has been updated')
        this.productForm.reset()
        this.dialogRef.close("update")
      },
      error: () => {
        alert('Error while updating the product')
      }
    })
  }
}
