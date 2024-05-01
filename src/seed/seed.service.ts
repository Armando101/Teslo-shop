import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data';

@Injectable()
export class SeedService {
  constructor(private productsService: ProductsService) {}

  async runSeed() {
    return (await this.insertNewProducts()) && `SEED EXECUTED`;
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const promises = initialData.products.map((product) =>
      this.productsService.create(product),
    );

    await Promise.all(promises);
    return true;
  }
}
