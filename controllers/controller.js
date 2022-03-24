const {Product, Category, Profile, User} = require('../models/index')
const passwordVisible = require("../helpers/passwordVisible")
const bcrypt = require('bcryptjs')

class Controller {

  static home (req, res) {
    res.render("home")
  }
  
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

  static registerForm (req, res) {
    res.render("registerForm", { passwordVisible })
  }
  
  static addUser (req, res) {
    let { userName, password, fullName, gender, email, phone, address } = req.body

    User.create({ userName, password})
    .then(newUser => {
      res.redirect("/")
    })
    .catch(err => {
      res.send(err)
    })
  }

  static loginForm (req, res) {
    res.render("login")
  }

  static loginPost(req, res) {
    let {userName, password} = req.body
    User.findOne({
      where: {
        userName : userName
      }
    })
    .then(user => {
      if (user) {
        let isValidPassword = bcrypt.compareSync(password, user.password)

        if (isValidPassword) {
          return res.redirect("/products")
        } else {
          let error = "invalid username/password"
          return res.redirect(`/login?error=${error}`)
        }
      } else {
        let error = "invalid username/password"
        return res.redirect(`/login?error=${error}`)
      }
    })
    .catch(err => {
      res.send(err)
    })
  }
}

module.exports = Controller