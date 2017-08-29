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
                        input(type="radio", value="normal", v-model="mode", checked)
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
                label.label(title="number of the series terms") count
              .field-body
                p.control
                  input.input(type="number", v-model.number="count")
            .field.is-horizontal
              .field-label.is-normal
                label.label(title="the value for f(x)") x
              .field-body
                p.control
                  input.input(type="number", v-model.number="x")

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
                p {{count}} terms of {{mode}} f(x) Fourier series :
            .columns
              .column
                span#asciiResult ``
            div.f_x(v-show="x")
              .columns
                .column
                  p and for f(x) where x = {{x}}
              .columns
                .column
                  span#FXResult ``
</template>

<script>
  import _ from 'lodash';
  import ascii from '../logic/ascii'

  MathJax.Hub.processSectionDelay = 0;

  const DEBOUNCE_WAIT  = 800

  export default {
    name: 'my-component',
    data() {
      return {
        expr: null,
        low: '-pi',
        high: 'pi',
        count: 3,
        mode: "normal",
        x : null
      };
    },
    mounted: function () {
      this.expr = "x^2 + x";
      this.x = 2;
    },

    methods: {
      calculateAndRenderGeneralX: function () {
        const am_list = ascii.FourierSeriesGeneralX(this.expr, this.low, this.high, this.count, this.mode)
      console.log(am_list)
        const string_ascii = `f(x) = ` + am_list
          .map(x => `[${x[0]} + ${x[1]}]`)
          .reduce((x, y) => `${x} + ${y}`)

        const res = MathJax.Hub.getAllJax("asciiResult")[0];
        MathJax.Hub.Queue(["Text", res, string_ascii]);
        if(this.x){
          this.calculateAndRenderFX()
        }
      },
      calculateAndRenderFX : function () {
        let value = ascii.FourierSeriesFX(this.expr, this.x, this.low, this.high, this.count, this.mode)
        console.log(value)
        let math = MathJax.Hub.getAllJax("FXResult")[0];
        MathJax.Hub.Queue(["Text", math, `f(${this.x}) = ${value}`]);
      }
    },

    watch: {

      // debounce to capture only the end result while typing
      expr: _.debounce(function () {
        let math = MathJax.Hub.getAllJax("exprRender")[0];
        MathJax.Hub.Queue(["Text", math, this.expr]);

        this.calculateAndRenderGeneralX();

      }, DEBOUNCE_WAIT),

      low: _.debounce(function () {

        if (!ascii.is_range_valid(this.low, this.high)) {
          alert("Invalid range! low must be less than high")

        } else {

          let math = MathJax.Hub.getAllJax("lowRender")[0];
          MathJax.Hub.Queue(["Text", math, this.low]);
          this.calculateAndRenderGeneralX();
        }
      }, DEBOUNCE_WAIT),

      high: _.debounce(function () {
        if (!ascii.is_range_valid(this.low, this.high)) {
          alert("Invalid range! low must be less than high")

        } else {

          let math = MathJax.Hub.getAllJax("highRender")[0];
          MathJax.Hub.Queue(["Text", math, this.high]);
          this.calculateAndRenderGeneralX();
        }
      }, DEBOUNCE_WAIT),

      mode: function () {
        this.calculateAndRenderGeneralX()
      },

      count: function () {
        this.calculateAndRenderGeneralX()
      },
      x : function () {
        if (this.x){
        this.calculateAndRenderFX()}
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
