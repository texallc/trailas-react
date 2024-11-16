export interface Cart {
  total: number;
  subtotal: number;
  taxes: number;
  discount: number;
  products: ProductInCart[];
}

export interface ProductInCart {
  productId: number;
  price: number;
  quantity: number;
}
