const math = require('mathjs')
const Fourier = require('./fourier')

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

let expr = 'cos(x^2) - 3x'

function run_me (f, x) {
  let inner = function (ff, xx) {
    console.log(ff(xx))
  }
  inner(f, x)
}

let me = new MathExpression(expr)
let f = me.evaluate
//run_me(f, 2)
let coeffs = new Fourier.FourierSeriesCoeffs(f, -math.pi, math.pi, 20)
console.log(coeffs)



module.exports = {isValidExpression, MathExpression}
