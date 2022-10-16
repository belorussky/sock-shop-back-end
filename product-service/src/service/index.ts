import CreateProductsServerice from "./createProduct";

// const productsServerice = new ProductsServerice(dynamoDBClient());
const createProductsServerice = new CreateProductsServerice();
export default createProductsServerice;