export type Product<T extends string | number> = {
  name: string;
  quantity: T;
  price: T;
};

export type ProductVariant = {
  name: string;
  quantity: number;
  price: number;
};

export type ProductVariantWithImage = ProductVariant & { images: Express.Multer.File[] };
