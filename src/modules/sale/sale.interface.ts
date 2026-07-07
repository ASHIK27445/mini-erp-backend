export interface ISaleItem {
  // keep a reference to the product id
  product: string;
  // snapshot of product data at the time of sale
  productSnapshot?: {
    _id: string;
    name: string;
    sku?: string;
    sellingPrice?: number;
    image?: string;
  };
  quantity: number;
  priceAtSale: number;
}

export interface ISale {
  items: ISaleItem[];
  grandTotal: number;
  soldBy: string;
}