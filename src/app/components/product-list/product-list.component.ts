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
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "Books";
  searchMode: boolean = false;

  //Pagination Properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string | null = this.route.snapshot.paramMap.get('keyword');

    if (keyword != null) {
      //Search for products using keyword
      this.productService.searchProducts(keyword).subscribe(
        data => {
          this.products = data;
        }
      );
    }
  }

  handleListProducts() {
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


    //Check if category is different than previous and reset page number if true
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`CurrentCategoryId: ${this.currentCategoryId}, PageNumber: ${this.pageNumber}`);

    //Get product for category id
    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      }
    );
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }
}
