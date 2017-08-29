"use strict"
import math from 'mathjs'
const pi = math.pi


function math_round(x) {
    return Math.round(x * 1000) / 1000
    // return x
}


function FourierSeriesCoeffs(f, lower_bound = -pi, upper_bound = pi , count = 3){

    let coeffs = []

    let a_0 = constant_a0(f, lower_bound, upper_bound)
    coeffs.push({a0 : math_round(a_0)})

    for (let n = 1; n < count; n++) {
        //series coeffs
        coeffs.push({ an : math_round(a_n_clause(f, n, lower_bound, upper_bound))
         	   	, bn : math_round(b_n_clause(f, n, lower_bound, upper_bound))})
    }
    return coeffs
}

function FourierSeriesSineCoeffs(f, lower_bound = -pi, upper_bound = pi , count = 3){

    let coeffs = []

    coeffs.push({a0 : 0})

    for (let n = 1; n < count; n++) {
        //series coeffs
        coeffs.push({ an : 0
                , bn : 2 * math_round(b_n_clause(f, n, 0, upper_bound))})
    }
    return coeffs
}



// for f(x) where x = x0
function FourierSeriesValue(x, coeffs, lower_bound, upper_bound){

    let acc  = 0
    acc += coeffs[0].a0/2

    for (let n = 1; n < coeffs.length; n++) {
        acc += coeffs[n].an * Math.cos(n*pi/upper_bound*x) + coeffs[n].bn * Math.sin(n*pi/upper_bound*x)
    }
    return acc
}
function FourierSeriesFX(f, x, lower_bound, upper_bound, count = 3){
    const coeffs = FourierSeriesCoeffs(f, lower_bound, upper_bound, count)
    console.log(coeffs)
    return FourierSeriesValue(x, coeffs , lower_bound, upper_bound)
}


function definite_integrate(f, a, b, step = 0.0001) {
    let acc = 0

    for (let x = a; x < b; x+= step) {
        acc +=  f(x + step / 2) * step;
    }
    return acc
}

function constant_a0(f, lower_bound, upper_bound) {

    return a_n_clause(f, 0, lower_bound, upper_bound)
}

function a_n_clause(f, n, lower_bound, upper_bound) {

     return 1/ upper_bound * definite_integrate( function(x) {
        return  f(x) * math.cos(n * pi * x/upper_bound) }
        , lower_bound, upper_bound)
}

function b_n_clause(f, n, lower_bound, upper_bound){

     return 1/ upper_bound * definite_integrate( function(x) {
        return  f(x) * math.sin(n * pi * x/upper_bound) }
        , lower_bound, upper_bound)
}


// var h = 'x*(pi-x)'
// var n = 6
// var l = '2pi'
// var f = math.parse('sin(pi/2*x) -x');
// // var g = math.parse(`${h}*sin(${n}*pi*x)`);

// console.log(f.eval({x: 5}));

//console.log(`1 / (${l}) * int_(${l})^(${l}) ${math.simplify(g).toString()}`)

//console.log(math.simplify(f).toString())


function func(x){
    return x*x + x;
}


export default {
  FourierSeriesCoeffs, math_round,
  FourierSeriesSineCoeffs
}
