import math from 'mathjs'
import Fourier from './fourier'

function is_valid_expression (expr) {
  try {
    math.parse(expr).eval({x: 1})
    return true
  }
  catch (ExpressionError) {
    return false
  }
}

//wrapper class for math.parse and math.eval
class MathExpression {
  constructor (expression) {
    if (!is_valid_expression(expression)) {
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

function only_if_not_1 (x) {
  // skip when number is 1
  if (x === 1) {
    return ''
  }
  return x
}

function coeffs_to_asciimath (coeffs, l, mode) {

  let res = []
  //calculate pi/l beforehand for shorter expressions
  let pi_l = new MathExpression(`pi/${l}`).evaluate(0)
  pi_l = Fourier.math_round(pi_l)
  pi_l = only_if_not_1(pi_l)

  // using asciimath and string interpolation
  // http://asciimath.org/ for syntax info

  let a_0 = (a0) => `${a0}/2`
  let a_n = (an, n) => `${an} cos(${n}*${pi_l}x)`
  let b_n = (bn, n) => `${bn} sin(${n}*${pi_l}x)`

  switch (mode) {
    case 'normal' :
      res.push([a_0(coeffs[0].a0), 0])
      for (let n = 1; n < coeffs.length; n++) {
        let {an, bn} = {an: coeffs[n].an, bn: coeffs[n].bn}

        res.push([a_n(an, n),
                b_n(bn, n)])
      }
      break
    case 'sine' :
      res.push([0, 0])
      for (let n = 1; n < coeffs.length; n++) {
        let bn = coeffs[n].bn
        res.push([0,
          b_n(bn, n)])
      }
      break
    case 'cosine' :
      res.push([a_0(coeffs[0].a0), 0])
      for (let n = 1; n < coeffs.length; n++) {
        let an = coeffs[n].an
        res.push([a_n(an, n),
                  0])
      }
  }

  return res
}

function FourierSeriesGeneralX (expr, low, high, count, mode = 'normal') {

  const math_exp = new MathExpression(expr)
  const low_eval = new MathExpression(low).evaluate(0)
  const high_eval = new MathExpression(high).evaluate(0)

  let coeffs = 0
  switch (mode) {
    case 'normal' :
      coeffs = new Fourier.FourierSeriesCoeffs(math_exp.evaluate, low_eval, high_eval, count)
      break
    case 'sine' :
      coeffs = new Fourier.FourierSeriesSineCoeffs(math_exp.evaluate, low_eval, high_eval, count)
      break
    case 'cosine' :
      coeffs = new Fourier.FourierSeriesCosineCoeffs(math_exp.evaluate, low_eval, high_eval, count)
      break
  }
  return coeffs_to_asciimath(coeffs, high, mode)
}

function is_range_valid (low, high) {
  const low_eval = new MathExpression(low).evaluate(0)
  const high_eval = new MathExpression(high).evaluate(0)

  return low_eval < high_eval

}

function FourierSeriesFX (expr, x, low, high, count , mode) {
  console.log(expr, x, low, high, count, mode)
  const math_exp = new MathExpression(expr)
  const low_eval = new MathExpression(low).evaluate(0)
  const high_eval = new MathExpression(high).evaluate(0)
  const x_eval = parseFloat(x)
  let coeffs = 0
  switch (mode) {
    case 'normal' :
      coeffs = new Fourier.FourierSeriesCoeffs(math_exp.evaluate, low_eval, high_eval, count)
      console.log(coeffs)
      break
    case 'sine' :
      coeffs = new Fourier.FourierSeriesSineCoeffs(math_exp.evaluate, low_eval, high_eval, count)
      break
    case 'cosine' :
      coeffs = new Fourier.FourierSeriesCosineCoeffs(math_exp.evaluate, low_eval, high_eval, count)
      break
  }
  return Fourier.FourierSeriesValue(x_eval, coeffs, low_eval, high_eval)

}
export default {
  is_range_valid,
  is_valid_expression,
  FourierSeriesGeneralX,
  FourierSeriesFX
}
