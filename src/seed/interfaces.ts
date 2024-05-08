import { CreateProductDto } from 'src/products/dto/create-product.dto';

export interface SeedData {
  users: SeedUser[];
  products: CreateProductDto[];
}

export interface SeedUser {
  email: string;
  fullName: string;
  password: string;
  role: string[];
}
