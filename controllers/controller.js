const { Product, Category, User, Profile } = require('../models/index')
const {Op} = require('sequelize')
const bcrypt = require('bcryptjs') 
const myFunction = require('../helpers/showPassword')

class Controller {

  static home(req, res) {
    res.render("home")
  }

  static products(req, res) {
    let keyword = req.query.search
    let sort = req.query.sortBy
    let sortResult

    if (!keyword) {
      keyword = ''
    }

    if (sort === 'high') {
      sortResult = [['price', 'DESC']]
    } else if (sort === 'low') {
      sortResult = [['price', 'ASC']]
    } else {
      sortResult = [['productName', 'ASC']]
    }

    Product.findAll({
      order: sortResult,
      include: {
        model: Category
      },
      where: {
        productName: {
          [Op.iLike]: `%${keyword}%`
        }
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
    const err = req.query.error
    res.render("login", { err })
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