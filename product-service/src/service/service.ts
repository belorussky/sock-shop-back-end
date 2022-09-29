// import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Product from "../models/product";

export default class ProductsServerice {

    // private Tablename: string = "";

    // constructor(private docClient: DocumentClient) { }

    async getProducts(productList: Product[]): Promise<Product[]> {
        return productList;
     }

    async getProductById(id: string, productList: Product[]): Promise<Product> {

        const product = productList.find((p) => p.id === id);

        return product;

    }
}