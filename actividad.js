class ProductManager {
  constructor({ id, title, description, price, thumbnail, code, stock }) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}
class ProductList {

  static nextIdProduct = 1;

  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  static getNewIdProduct() {
    return ProductList.nextIdProduct++;
  }

  addProduct(dataProduct) {
    const idProduct = ProductList.getNewIdProduct();
    const product = new ProductManager({ code: idProduct, ...dataProduct });
    this.products.push(product);
    return product;
  }

  sortProductsById() {
    this.products.sort((a, b) => a.code - b.code);
  }

  getProductByCode(codeId) {
    const product = this.products.find((product) => product.code === codeId);
    if (product) {
      return product;
    } else {
      return "Producto no encontrado";
    }
  }

  incluirProducto(idProduct, newPrice, newStock, newTitle, newDescription) {
    const product = this.products.find(e => e.code === idProduct);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    const newProduct = new ProductManager({
      ...product,
      code: ProductList.getNewIdProduct(),
      price: newPrice,
      stock: newStock,
      title: newTitle,
      description: newDescription

    });
    this.products.push(newProduct);
    return newProduct;
  }
}

//PRUEBA

const manejadorProductos = new ProductList();

console.log('Agregado alimento balanceado para gatos');
const productoAgregado = manejadorProductos.addProduct({
  title: 'Catchow para gatos',
  price: 500,
  stock: 20,
  description: 'Alimento balanceado premium',
  thumbnail: 'url img'
});
console.log('Producto agregado: ', productoAgregado);



console.log('Creando copia de producto con información diferente');
const productoCopiado = manejadorProductos.incluirProducto(1, 300, 20, 'Dogchow para perros', 'Alimento balancceado');
console.log('Producto copiado: ', productoCopiado);

console.log('Listado de productos: ', manejadorProductos.getProducts());


console.log('Buscando producto con código 1');
try {
  const productoEncontrado = manejadorProductos.getProductByCode(1);
  console.log('Producto encontrado: ', productoEncontrado);
} catch (error) {
  console.log(error.message);
}

// Se hace fallar a proposito para devolver el mensaje y cumplir con la consigna

console.log('Buscando producto con código 5');
try {
  const productoEncontrado = manejadorProductos.getProductByCode(5);
  console.log('Producto encontrado: ', productoEncontrado);
} catch (error) {
  console.log(error.message);
}