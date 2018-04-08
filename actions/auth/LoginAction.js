const Joi = require('joi')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const auth = require('../../services/auth')

class LoginAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        password: Joi.string().required(),
        email: Joi.string().email().min(6).max(30).required()
      })
    }
  }

  static run (req, res, next) {
    let userEntity = {}
    let tokens = { accessToken: '', refreshToken: '', expiresIn: 0 }

    this.validate(req, this.validationRules)
      .then(() => UserDAO.GetByEmail(req.body.email))
      .then(user => {
        userEntity = user
        return auth.checkPassword(req.body.password, user.passwordHash)
      })
      .then(() => auth.makeAccessToken(userEntity))
      .then(accessToken => (tokens.accessToken = accessToken))
      .then(() => auth.parseTokenData(tokens.accessToken))
      .then(accessTokenData => (tokens.expiresIn = accessTokenData.exp))
      .then(() => auth.makeRefreshToken(userEntity))
      .then(refreshToken => (tokens.refreshToken = refreshToken))
      .then(() => res.json({ data: tokens, success: true }))
      .catch(error => next(error))
  }
}

module.exports = LoginAction