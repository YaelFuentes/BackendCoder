const { promises: fs } = require('fs')

class ProductManager {
  constructor({ id, title, description, price, thumbnail, stock }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.stock = stock;
  }
  updateField(fieldName, value) {
    this[fieldName] = value;
  }
}

class ProductList {
  static nextIdProduct = 1;

  constructor({ ruta }) {
    this.ruta = ruta;
    this.products = [];
  }

  async reset() {
    this.products = []
    await this.writeProducts()
  }

  async reedProducts() {
    try {
      const productsJson = await fs.readFile(this.ruta, 'utf-8')
      const productArray = JSON.parse(productsJson);
      this.products = productArray.map(p => new ProductManager(p))
    } catch (e) {
      console.error('Error al leer los productos', e)
    }
  }

  async writeProducts() {
    try {
      const productsJson = JSON.stringify(this.products, null, 2)
      await fs.writeFile(this.ruta, productsJson)
    } catch (e) {
      console.error('Error al escribir los productos: ', error)
    }
  }


  async getProducts() {
    await this.reedProducts()
    return this.products;
  }

  async updateProduct(id, dataProduct) {
    await this.reedProducts();
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      const newProduct = new ProductManager({ id, ...this.products[index], ...dataProduct })
      this.products[index] = newProduct;
      await this.writeProducts()
      return newProduct
    } else {
      throw new Error('Error al actualizar los datos: usuario no encontrado')
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }
    const deletedProduct = this.products.splice(index, 1)[0];

    return deletedProduct;
  }


  static getNewIdProduct() {
    return ProductList.nextIdProduct++;
  }

  async addProduct(dataProduct) {
    const idProduct = ProductList.getNewIdProduct();
    const product = new ProductManager({ id: idProduct, ...dataProduct });
    this.products.push(product);
    await this.writeProducts();
    return product;
  }

  async sortProductsById() {
    this.products.sort((a, b) => a.id - b.id);
  }

  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      return "Producto no encontrado";
    }
  }

  async incluirProducto(id, newPrice, newStock, newTitle, newDescription) {
    const product = this.products.find(e => e.id === id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    const newProduct = new ProductManager({
      ...product,
      id: ProductList.getNewIdProduct(),
      price: newPrice,
      stock: newStock,
      title: newTitle,
      description: newDescription
    });
    this.products.push(newProduct);
    return newProduct;
  }
}

async function main() {
  const PList = new ProductList({ ruta: 'products.json' })
  PList.reset()
  console.log('Producto agregado: ', await PList.addProduct({
    title: 'Alimento Gato',
    description: 'alimento balanceado para gatos',
    price: 13000,
    thumbnail: 'url',
    stock: 12
  }))
  console.log('Producto agregado: ', await PList.addProduct({
    title: 'Alimento perro',
    description: 'alimento balanceado para perros',
    price: 18000,
    thumbnail: 'url',
    stock: 12
  }))

  console.log('productos obtenidos: ', await PList.getProducts())
  console.log('productos actualizados: ', await PList.updateProduct(1, { title: 'Alimento Gatos adulto' }))
  console.log('productos borrados: ', await PList.deleteProduct(1))

}

main()

