import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private productsService: ProductsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUSers = await this.insertUsers();
    return (await this.insertNewProducts(adminUSers)) && `SEED EXECUTED`;
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    // insert into users
    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const promises = initialData.products.map((product) =>
      this.productsService.create(product, user),
    );

    await Promise.all(promises);
    return true;
  }
}
