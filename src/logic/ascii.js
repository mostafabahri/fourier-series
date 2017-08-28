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

function coeffs_to_asciimath (coeffs, l) {
  let res = []
  l = Fourier.math_round(l)
  res.push([`${coeffs[0].a0}/2`, 0])
  for (let i = 1; i < coeffs.length; i++) {
    res.push([`${coeffs[i].an}* cos (${i}pi/${l}x)`,
      `${coeffs[i].bn} * sin (${i}pi/${l}x)`])
  }
  return res
}

function view_wrapper (expr, low, high, count) {

  const mathexp = new MathExpression(expr)
  const low_eval = new MathExpression(low).evaluate(0)
  const high_eval = new MathExpression(high).evaluate(0)
  console.log(mathexp, low_eval, high_eval)
  const coeffs = new Fourier.FourierSeriesCoeffs(mathexp.evaluate, low_eval, high_eval, count)
  return coeffs_to_asciimath(coeffs, high_eval)
}

// let me = new MathExpression(expr)
// let f = me.evaluate
// run_me(f, 0)
// let coeffs = new Fourier.FourierSeriesCoeffs(f, -math.pi, math.pi, 5)
// console.log(coeffs)


export default {
  view_wrapper
}
