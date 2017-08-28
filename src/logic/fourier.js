"use strict"
const math = require("mathjs")
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

// function trap_definite_integrate(f, a, b, step = 0.0001) {
//     n = 10000
//     let diff = (b - a) / n
//     let series_acc  = 0
//     for(let k = 0; k < n; k++){
//         series_acc  += f(a + k*(diff))
//     }
//     return diff*(f(a)/2 + series_acc + f(b)/2)
// }
//    total += [a_n_clause(f, n, lower_bound, upper_bound) * math.cos(n*pi/upper_bound*x)
//   	   + b_n_clause(f, n, lower_bound, upper_bound) * math.sin(n*pi/upper_bound*x)]
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


 // example function f(x) = 3*x^2

function coeffs_to_asciimath(coeffs, l = pi){
    let res = []
    l = math_round(l)
    res.push([`${coeffs[0].a0}/2`, 0])
    for (let i = 1; i < coeffs.length; i++) {
        res.push([`${coeffs[i].an} * cos (${i}*pi*x/${l})`,
        `${coeffs[i].bn} * sin (${i}*pi*x/${l})`])
    }
    return res
}

//console.log(b_n_clause(f,-pi, pi,1))

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

//  console.log(definite_integrate(func, -pi , +pi)) // ~ 4
//
// let all_coeffs = FourierSeriesCoeffs(func, -pi, pi, 5)
// let mapped_to_ml = coeffs_to_asciimath(all_coeffs, pi)
// console.log(mapped_to_ml.map( x => `(${x[0]} + ${x[1]})`)
//                         .reduce( (x, y) =>  `${x} + ${y}`))
// console.log(FourierSeriesFX(func, 3, -pi, pi, 100))
//
//  const sineCoeffs = FourierSeriesSineCoeffs(func, -pi, pi , 10)
//  console.log(sineCoeffs)

module.exports = {
  FourierSeriesCoeffs
}
