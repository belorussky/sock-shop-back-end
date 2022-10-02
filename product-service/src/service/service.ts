// import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Product from "../models/product";
import productList from '../functions/getProductsList/mock.json';

export default class ProductsServerice {

    // private Tablename: string = "";

    // constructor(private docClient: DocumentClient) { }

    async getProducts(): Promise<Product[]> {
        return productList as Product[];
     }

    async getProductById(id: string): Promise<Product> {
        const product = Object.values(productList).filter(e => {
            if (Object.values(e).find(v => v === id)) {
                return Object.values(e);
            }
        });

        if (Object.keys(product).length === 0) {
            throw new Error("Product not found");
        }

        return product as unknown as Product;

    }
}