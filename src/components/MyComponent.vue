<template lang="pug">
  section.section
    .container
      .columns
        .column.is-4#properties
          .box
            h4.title.is-4 Properties
            .field.is-horizontal
              .field-label.is-normal
                label.label f(x)
              .field-body
                .field
                  p.control.is-exapnded
                    input.input(type="text", v-model="expr", placeholder="x^2 + x/cos(2*x)")
            .field.is-horizontal
              .field-label.is-normal
                label.label range
              .field-body
                .field
                  p.control
                    input.input(type="text", v-model="low", placeholder="low")
                //- span.is-normal to
                .field
                  p.control
                    input.input(type="text", v-model="high", placeholder="high")
            .field.is-horizontal
              .field-label
                label.label mode
              .field-body
                .field
                  div.control
                    .one
                      label.radio
                        input(type="radio", value="all", v-model="mode", checked)
                        |  normal series
                    .two
                      label.radio
                        input(type="radio", value="sine", v-model="mode")
                        |  sine series
                    .three
                      label.radio
                        input(type="radio", value="cosine", v-model="mode")
                        |  cosine series
            .field.is-horizontal
              .field-label.is-normal
                label.label count
              .field-body
                p.control
                  input.input(type="number", v-model.number="count")

        .column#results
          .box
            h4.title.is-4 Results
            .columns
              .column.is-6
                p
                  span `f(x) =`
                  span#exprRender `x^2 + x/cos(2*x)+ ln(x/3)`
              .column.is-3
                p
                  span `(`
                  span#lowRender `{{low}}`
                  span `, `
                  span#highRender `{{high}}`
                  span `)`
            .columns
              .column
                p `f(x) = a_0/2 + sum_(i=1)^n a_n cos(2pi/lx) + b_n sin(2pi/lx)`
            .columns
              .column
                p {{count}} of {{mode}} terms of f(x) Fourier series :
</template>

<script>
  import _ from 'lodash';

  MathJax.Hub.processSectionDelay = 0;
  export default {
    name: 'my-component',
    data() {
      return {
        expr: 'x/cos(2*x)+ ln(x/3)',
        low: '-pi',
        high: 'pi',
        count: 3,
        mode: "all"
      };
    },
    methods: {

    },
    watch: {
      // debounce to capture only the end result while typing
      expr: _.debounce(function () {
        let math = MathJax.Hub.getAllJax("exprRender")[0];
        MathJax.Hub.Queue(["Text", math, this.expr]);
      }, 800),
      low: _.debounce(function () {
        let math = MathJax.Hub.getAllJax("lowRender")[0];
        MathJax.Hub.Queue(["Text", math, this.low]);
      }, 800),
      high: _.debounce(function () {
        let math = MathJax.Hub.getAllJax("highRender")[0];
        MathJax.Hub.Queue(["Text", math, this.high]);
      }, 800),
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
