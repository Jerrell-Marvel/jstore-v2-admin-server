export type ProductVariant = {
  name: string;
  quantity: number;
  price: number;
};

export type ProductVariantWithImage = ProductVariant & { images: Express.Multer.File[] };
