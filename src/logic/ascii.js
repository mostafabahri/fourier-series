import math from 'mathjs'
import Fourier from './fourier'

function isValidExpression (expr) {
  try {
    math.parse(expr).eval({x: 1})
    return true
  }
  catch (ExpressionError) {
    return false
  }
}

class MathExpression {
  constructor (expression) {
    if (!isValidExpression(expression)) {
      throw EvalError('Invalid mathjs expression, correct it!')
    }

    // http://mathjs.org/docs/expressions/parsing.html
    const node = math.parse(expression)
    this.code = node.compile()
    this.evaluate = this.evaluate.bind(this)
  }

  evaluate (x) {
    return this.code.eval({x: x})
  }

}

let expr = '2/3pi*x'

function run_me (f, x) {
  let inner = function (ff, xx) {
    console.log(ff(xx))
  }
  inner(f, x)
}

function only_if_not_1 (x) {
  if (x === 1) {
    return ''
  }
  return x
}

function coeffs_to_asciimath (coeffs, l, mode) {
  let res = []
  let pi_l = new MathExpression(`pi/${l}`).evaluate(0)
  pi_l = only_if_not_1(pi_l)
  switch (mode) {
    case 'normal' :
      res.push([`${coeffs[0].a0}/2`, 0])
      for (let n = 1; n < coeffs.length; n++) {
        let {an, bn} = {an: coeffs[n].an, bn: coeffs[n].bn}

        res.push([`${an} * cos(${n}*${pi_l}x)`,
                  `${bn} * sin(${n}*${pi_l}x)`])
      }
      break
    case 'sine' :
      res.push([0, 0])
      for (let n = 1; n < coeffs.length; n++) {
        let {bn} = {bn: coeffs[n].bn}
        res.push([0,
                `${bn} * sin(${n}*${pi_l}x)`])
      }
  }
  // math simplify can help

  return res
}

function view_wrapper (expr, low, high, count, mode = 'normal') {

  const mathexp = new MathExpression(expr)
  const low_eval = new MathExpression(low).evaluate(0)
  const high_eval = new MathExpression(high).evaluate(0)
  console.log(mathexp, low_eval, high_eval)
  let coeffs = 0
  switch (mode) {
    case 'normal' :
      coeffs = new Fourier.FourierSeriesCoeffs(mathexp.evaluate, low_eval, high_eval, count)
      break
    case 'sine' :
      coeffs = new Fourier.FourierSeriesSineCoeffs(mathexp.evaluate, low_eval, high_eval, count)
      break
    case 'cosine' :
      throw Error('not implemented')
  }
  return coeffs_to_asciimath(coeffs, high, mode)
}


export default {
  view_wrapper
}
