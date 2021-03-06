const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class RemoveAction extends BaseAction {
  static get accessTag () {
    return 'posts:delete'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static run (req, res, next) {
    this.init(req, this.validationRules, this.accessTag)
      .then(() => PostDAO.BaseGetById(+req.params.id))
      .then(model => this.checkAccessByOwnerId(model))
      .then(() => PostDAO.BaseRemove(+req.params.id))
      .then(() => res.json(this.resJson({ message: `${req.params.id} was removed` })))
      .catch(error => next(error))
  }
}

module.exports = RemoveAction
