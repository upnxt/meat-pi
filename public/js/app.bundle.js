webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (state => {
    if (state < 0) {
        return "disabled";
    } else {
        return state == 0 ? "off" : "on";
    }
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((values, history) => {
    if (!values || values.length <= 0) values = history;else {
        const l = history.length - values.length;
        if (l > 0) values.concat(history.splice(l));
    }

    if (values.length > 30) {
        values = values.slice(values.length - 30);
    }

    return values;
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_0_vue___default.a());

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(19),
  /* template */
  null,
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const Vue = __webpack_require__(1);

Vue.use(__webpack_require__(6));
Vue.component("fan", __webpack_require__(14));
Vue.component("humidity", __webpack_require__(17));
Vue.component("temperature", __webpack_require__(24));

const app = new Vue({
    el: "#app"
});

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(15),
  /* template */
  __webpack_require__(16),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_stateParser__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_historyManager__ = __webpack_require__(4);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      values: [],
      history: [],
      state: "disabled"
    };
  },
  methods: {
    poll() {
      this.$http.get("http://192.168.0.18:3000/api/fan").then(response => {
        this.h = response.body.h;
        this.state = Object(__WEBPACK_IMPORTED_MODULE_0__utils_stateParser__["a" /* default */])(response.body.state);
        this.values = Object(__WEBPACK_IMPORTED_MODULE_1__utils_historyManager__["a" /* default */])(this.values, response.body.history);

        for (let i = 0; i < this.values.length; i++) {
          if (this.values[i].value == 1 && this.values[i + 1] && this.values[i + 1].value == 0) {
            var exists = this.history.filter(m => m.on == this.values[i].on);
            if (exists.length > 0) {
              continue;
            }

            this.history.push({
              on: this.values[i].on,
              duration: Math.floor((new Date(this.values[i + 1].timestamp) - new Date(this.values[i].timestamp)) / 1000 / 60)
            });
          }
        }
      }, err => {
        console.log(err);
      });
    }
  },
  mounted() {
    this.poll();

    setInterval(() => {
      this.poll();
    }, 1000 * 10);
  }
});

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "control"
  }, [_c('div', {
    staticClass: "reading"
  }, [_c('header', [_c('h4', [_vm._v("Fan")]), _vm._v(" "), _c('span', {
    class: ['state', _vm.state],
    attrs: {
      "title": _vm.state
    }
  })]), _vm._v(" "), _c('h1', [_vm._v(_vm._s(_vm.state))])]), _vm._v(" "), _c('div', {
    staticClass: "chart"
  }, _vm._l((_vm.history), function(entry) {
    return _c('ul', [_c('li', [_c('strong', [_vm._v(_vm._s(entry.on))]), _vm._v(" ran for " + _vm._s(entry.duration) + " minute" + _vm._s((_vm.duration != 1 ? "s" : "")) + " ")])])
  }), 0)])
},staticRenderFns: []}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(18),
  /* template */
  __webpack_require__(23),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chart_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chart_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__chart_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bus__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_stateParser__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_historyManager__ = __webpack_require__(4);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      values: [],
      state: "disabled",
      h: -1
    };
  },
  components: {
    chart: __WEBPACK_IMPORTED_MODULE_0__chart_vue___default.a
  },
  methods: {
    poll() {
      this.$http.get("http://192.168.0.18:3000/api/humidity").then(response => {
        this.h = response.body.h;
        this.state = Object(__WEBPACK_IMPORTED_MODULE_2__utils_stateParser__["a" /* default */])(response.body.state);
        this.values = Object(__WEBPACK_IMPORTED_MODULE_3__utils_historyManager__["a" /* default */])(this.values, response.body.history);

        __WEBPACK_IMPORTED_MODULE_1__bus__["a" /* default */].$emit("humidity:chart:update", this.values);
      }, err => {
        console.log(err);
      });
    }
  },
  mounted() {
    this.poll();

    setInterval(() => {
      this.poll();
    }, 1000 * 10);
  }
});

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_chartjs__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_chartjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_chartjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bus__ = __webpack_require__(5);




/* harmony default export */ __webpack_exports__["default"] = ({
  extends: __WEBPACK_IMPORTED_MODULE_0_vue_chartjs__["Line"],
  props: ["label", "evt"],
  data: () => ({
    chartdata: {
      labels: [new Date()],
      datasets: [{
        backgroundColor: "#e6e6e6",
        borderColor: "#cacaca",
        pointRadius: 5,
        pointHoverRadius: 8,
        data: [0]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            suggestedMin: 50,
            //   min: 0,
            beginAtZero: false
            //   steps: 2
            //display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          type: "time",
          autoSkip: false,
          time: {
            unit: "minute"
            //   unitStepSize: 1
          },
          ticks: {
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      }
    }
  }),
  mounted() {
    this.renderChart(this.chartdata, this.options);

    __WEBPACK_IMPORTED_MODULE_1__bus__["a" /* default */].$on(this.evt, data => {
      this.chartdata.labels = data.map(m => new Date(m.timestamp));
      this.chartdata.datasets[0].data = data.map(m => m.value);
      this.$data._chart.update();
    });
  }
});

/***/ }),
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "control"
  }, [_c('div', {
    staticClass: "reading"
  }, [_c('header', [_c('h4', [_vm._v("Humidity")]), _vm._v(" "), _c('span', {
    class: ['state', _vm.state],
    attrs: {
      "title": _vm.state
    }
  })]), _vm._v(" "), _c('h1', [_vm._v(_vm._s(_vm.h)), _c('sup', [_vm._v("%")])])]), _vm._v(" "), _c('div', {
    staticClass: "chart"
  }, [_c('chart', {
    attrs: {
      "label": "%",
      "evt": "humidity:chart:update"
    }
  })], 1)])
},staticRenderFns: []}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(25),
  /* template */
  __webpack_require__(26),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chart_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chart_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__chart_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bus__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_stateParser__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_historyManager__ = __webpack_require__(4);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      values: [],
      state: "disabled",
      f: -1,
      c: -1
    };
  },
  components: {
    chart: __WEBPACK_IMPORTED_MODULE_0__chart_vue___default.a
  },
  methods: {
    poll() {
      this.$http.get("http://192.168.0.18:3000/api/temperature").then(response => {
        this.f = response.body.f;
        this.c = response.body.c;
        this.state = Object(__WEBPACK_IMPORTED_MODULE_2__utils_stateParser__["a" /* default */])(response.body.state);
        this.values = Object(__WEBPACK_IMPORTED_MODULE_3__utils_historyManager__["a" /* default */])(this.values, response.body.history);

        __WEBPACK_IMPORTED_MODULE_1__bus__["a" /* default */].$emit("temperature:chart:update", this.values);
      }, err => {
        console.log(err);
      });
    }
  },
  mounted() {
    this.poll();

    setInterval(() => {
      this.poll();
    }, 1000 * 5);
  }
});

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "control"
  }, [_c('div', {
    staticClass: "reading"
  }, [_c('header', [_c('h4', [_vm._v("Temperature")]), _vm._v(" "), _c('span', {
    class: ['state', _vm.state],
    attrs: {
      "title": _vm.state
    }
  })]), _vm._v(" "), _c('h1', [_vm._v(_vm._s(_vm.f)), _c('sup', [_vm._v("°F")])]), _vm._v(" "), _c('footer', [_vm._v(_vm._s(_vm.c)), _c('sup', [_vm._v("°C")])])]), _vm._v(" "), _c('div', {
    staticClass: "chart"
  }, [_c('chart', {
    attrs: {
      "label": "F",
      "evt": "temperature:chart:update"
    }
  })], 1)])
},staticRenderFns: []}

/***/ })
],[9]);
//# sourceMappingURL=app.bundle.js.map