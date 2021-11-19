import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products?: Product[];
  currentCategoryId?: number;
  currentCategoryName?: string;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    //Check if id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get id and convert string to number
      
      const id: string | null = this.route.snapshot.paramMap.get('id');
      if (id != null) {
        this.currentCategoryId = +id;
      } else {
        this.currentCategoryId = 1;
      }

      //Get the name param
      const name: string | null = this.route.snapshot.paramMap.get('name');
      if (name != null) {
        this.currentCategoryName = name;
      } else {
        this.currentCategoryName = 'Books';
      }
    } else {
      //No category id available
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //Get product for category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
