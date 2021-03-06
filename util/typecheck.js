const typeCheck = require('type-check').typeCheck
const ErrorWrapper = require('./ErrorWrapper')
const errorCodes = require('../config/errorCodes')

/**
 * validate function argument
 */
module.exports = (argument, type, required) => {
  /**
   * check if required
   */
  if ((required && !argument) && (argument !== 0)) {
    throw new ErrorWrapper({ ...errorCodes.NO_ARGUMENT })
  }
  /**
   * check arguments type
   */
  const isArgumentExist = [0, null, false, NaN].includes(argument) || argument
  if (isArgumentExist && !typeCheck(type, argument)) {
    throw new ErrorWrapper({ ...errorCodes.ARGUMENT_TYPE })
  }
}
