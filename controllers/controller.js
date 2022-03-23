const {Product, Category} = require('../models/index')

class Controller {
  static products (req, res) {
    Product.findAll()
    .then(data => {
      res.render("listProduct", {data})
    })
  }

  static byCategory (req, res) {
    let idCategory = req.params.CategoryId
    Product.findAll({
      include: Category,
      where: {
        CategoryId : idCategory
      }
    })
    .then(data => {
      res.render("byCategoryPage", {data})
    })
    .catch(err => {
      res.send(err)
    })
  }
  
}

module.exports = Controller