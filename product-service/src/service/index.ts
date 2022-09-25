// import dynamoDBClient from "../model/database";
import ProductsServerice from "./service";

// const productsServerice = new ProductsServerice(dynamoDBClient());
const productsServerice = new ProductsServerice();
export default productsServerice;