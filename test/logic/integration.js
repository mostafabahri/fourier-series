import test from 'ava'
import almostEqual from 'almost-equal'

import integrate from '../../src/logic/integration'

test('linear polynomial on symmetric domain', t => {
  t.is(integrate((x) => {
    return 3 * x
  }, -3, 3), 0)
})
test('linear polynomial on asymmetric domain', t => {
  t.is(integrate((x) => {
    return 3 * x
  }, -4, 11), 157.5)
})
test('second degree polynomial on asymmetric domain', t => {
  t.is(integrate((x) => {
    return 3 * x ** 2
  }, -1, 5), 126)
})

test('high degree polynomial on asymmetric domain', t => {
  t.is(integrate((x) => {
    return x ** 9
  }, -11.5, 5), -4044581173.20791)
})

test('computational heavy polynomial on asymmetric domain', t => {
  t.is(integrate((x) => {
    return (2 * x ** 5 - x + 3) / x ** 2
  }, 1, 2, 0.001), 8.307235827664398)
})

const pi = Math.PI
test('odd function on symmetric domain', t => {
  t.is(integrate(x => {
    return x ** 3
  }, -pi, pi), 0)
})

test('even function on symmetric domain', t => {
  const f = x => x ** 2
  t.true(almostEqual(integrate(f, -pi, pi), 2 * integrate(f, 0, pi)),
    almostEqual.FLT_EPSILON)
})

test('almost-equal remembrance ', t => {
  t.true(almostEqual(3.512, 3.5129859121, 0.001))
})
