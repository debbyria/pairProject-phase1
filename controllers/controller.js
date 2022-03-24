const {Product, Category} = require('../models/index')

class Controller {
  static products (req, res) {

    Product.findAll({
      order: [['productName', 'ASC']],
      include: {
        model: Category
      }
    }).then(data => {
      res.render('products', { products : data, Product})
    }).catch(error => {
      console.log(error)
      res.send(error)
    })

  }
}

module.exports = Controller