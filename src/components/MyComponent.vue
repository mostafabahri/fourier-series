<template lang="pug">
  section.section
    .container
      .columns
        .column.is-4
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
                        |  all terms
                    .two
                      label.radio
                        input(type="radio", value="sine", v-model="mode")
                        |  sine terms
                    .three
                      label.radio
                        input(type="radio", value="cosine", v-model="mode")
                        |  cosine terms
            .field.is-horizontal
              .field-label.is-normal
                label.label count
              .field-body
                p.control
                  input.input(type="number", v-model.number="count")

        .column
          .box
            h4.title.is-4 Result
            .columns
              .column.is-6
                p
                  span `f(x) =`
                  span#exprRender `x^2 + x/cos(2*x)+ ln(x/3)`
              .column.is-3
                p ` ({{low}}, {{high}})`
            .columns
              .column
                p `f(x) = a_0/2 + sum_(i=1)^n a_n cos(2pi/lx) + b_n sin(2pi/lx)`
            .columns
              .column
                p {{count}} of {{mode}} terms of f(x) Fourier series :
</template>

<script>
  export default {
    name: 'my-component',
    data() {
      return {
        xpr: 'x^2 + x/cos(2*x)+ ln(x/3)',
        low: '-pi',
        high: 'pi',
        count: 3,
        mode: "all"
      };
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
