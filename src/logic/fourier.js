'use strict'
import math from 'mathjs'
const pi = math.pi
import definite_integrate from './integration'

function math_round (x) {
  // round number up to 3 floating points
  return Math.round(x * 1000) / 1000
  // return x
}

function FourierSeriesCoeffs (f, low = -pi, high = pi, count = 3) {

  let coeffs = []

  let a_0 = constant_a0(f, low, high)
  coeffs.push({a0: math_round(a_0)})
  // calculating the sum
  for (let n = 1; n < count; n++) {
    //series coeffs
    coeffs.push({
      an: math_round(a_n_clause(f, n, low, high))
      , bn: math_round(b_n_clause(f, n, low, high))
    })
  }
  return coeffs
}

function FourierSeriesSineCoeffs (f, low = -pi, high = pi, count = 3) {

  let coeffs = []

  coeffs.push({a0: 0})

  for (let n = 1; n < count; n++) {

    coeffs.push({
      an: 0
      , bn: 2 * math_round(b_n_clause(f, n, 0, high))
    })
  }
  return coeffs
}

function FourierSeriesCosineCoeffs (f, low = -pi, high = pi, count = 3) {

  let coeffs = []

  let a_0 = 2 * constant_a0(f, 0, high)
  coeffs.push({a0: math_round(a_0)})

  for (let n = 1; n < count; n++) {
    //series coeffs
    coeffs.push({
      an: 2 * math_round(a_n_clause(f, n, 0, high))
      , bn: 0
    })
  }
  return coeffs
}

// for f(x) where x = x0, given series coefficients
function FourierSeriesValue (x, coeffs, low, high) {

  let acc = 0
  acc += coeffs[0].a0 / 2
  // the pi/l in cos(n*pi/lx) and sin(n*pi/lx)
  let pi_l = pi / high
  for (let n = 1; n < coeffs.length; n++) {
    acc += coeffs[n].an * math.cos(n * pi_l * x) + coeffs[n].bn * math.sin(n * pi_l * x)
  }

  return acc
}

// function definite_integrate (f, a, b, step = 0.0001) {
//   let acc = 0
//
//   for (let x = a; x < b; x += step) {
//     acc += f(x + step / 2) * step
//   }
//   return acc
// }

function constant_a0 (f, low, high) {

  return a_n_clause(f, 0, low, high)
}

function a_n_clause (f, n, low, high) {

  return 1 / high * definite_integrate(function (x) {
        return f(x) * math.cos(n * pi * x / high)
      }
      , low, high)
}

function b_n_clause (f, n, low, high) {

  return 1 / high * definite_integrate(function (x) {
        return f(x) * math.sin(n * pi * x / high)
      }
      , low, high)
}

export default {
  math_round,
  FourierSeriesCoeffs,
  FourierSeriesSineCoeffs,
  FourierSeriesCosineCoeffs,
  FourierSeriesValue
}
