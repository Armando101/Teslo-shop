import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  stock?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
}
