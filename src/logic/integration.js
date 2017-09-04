// Calculates numeric integral based on Adaptive Simpson's Rule
// for relatively fast integration on a variety of functions
// https://en.wikipedia.org/wiki/Adaptive_Simpson%27s_method

const default_rec_depth = 12
const default_eps = 0.001

function simpsons_rule (h3, fa, fb, fc) {
  return h3 * ((fa + (4.0 * fc)) + fb)
}
function recursive_asr (f, a, b, eps, whole, fa, fb, fc, rec_depth = default_rec_depth) {

  /* Recursive implementation of adaptive Simpson's rule. */

  let c, d, e, fd, fe, h6, left, right, sim;
  [c, h6] = [((a + b) / 2.0), ((b - a) / 12.0)];
  [d, e] = [((a + c) / 2.0), ((c + b) / 2.0)];
  [fd, fe] = [f(d), f(e)]
  left = simpsons_rule(h6, fa, fc, fd)
  right = simpsons_rule(h6, fc, fb, fe)
  sim = left + right

  if ((rec_depth <= 0) || (Math.abs((sim - whole)) <= (15 * eps))) {
    return sim + ((sim - whole) / 15.0)
  }

  return recursive_asr(f, a, c, (eps / 2.0), left, fa, fc, fd, (rec_depth - 1))
    + recursive_asr(f, c, b, (eps / 2.0), right, fc, fb, fe, (rec_depth - 1))
}

function adaptive_simpsons_rule (f, a, b, eps = default_eps) {

  /* Calculate integral of f from a to b with max error of eps. */

  let c, fa, fb, fc, h3, whole;
  [c, h3] = [((a + b) / 2.0), ((b - a) / 6)];
  [fa, fb, fc] = [f(a), f(b), f(c)]
  whole = simpsons_rule(h3, fa, fb, fc)

  return recursive_asr(f, a, b, eps, whole, fa, fb, fc)
}

export default adaptive_simpsons_rule
//
// console.log(adaptive_simpsons_rule((x) => {
//   return 3 * x ** 2
// }, -1, 5, 0.001))
// console.log("hey")
