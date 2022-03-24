const { Product, Category, User, Profile } = require('../models/index')
const bcrypt = require('bcryptjs') 
const myFunction = require('../helpers/showPassword')

class Controller {

  static home(req, res) {
    res.render("home")
  }

  static products(req, res) {
    Product.findAll({
      order: [['productName', 'ASC']],
      include: {
        model: Category
      }
    }).then(data => {
      res.render('products', { products: data, Product })
    }).catch(error => {
      console.log(error)
      res.send(error)
    })
  }

  static registerForm(req, res) {
    res.render("registerForm")
  }

  static addUser(req, res) {
    const { userName, password, fullName, gender, email, phone, address, membership} = req.body

    User.create({ 
      userName, password, membership
    }).then((result) => {
      return Profile.create({
        fullName, gender, email, phone, address, UserId: result.id
      })
    }).then(() => {
        res.redirect("/login")
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  }

  static loginForm(req, res) {
    res.render("login", { myFunction })
  }

  static loginPost(req, res) {
    let { userName, password } = req.body
    User.findOne({
      where: {
        userName: userName
      }
    })
      .then(user => {
        if (user) {
          let isValidPassword = bcrypt.compareSync(password, user.password)

          if (isValidPassword) {


            req.session.userId = user.id
            req.session.membership = user.membership


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

  static getLogOut (req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.send(err)
      } else {
        res.redirect('/login')
      }
    })

  }


}

module.exports = Controller