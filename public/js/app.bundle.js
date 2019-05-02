webpackJsonp([0],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);

/* harmony default export */ __webpack_exports__["default"] = (new __WEBPACK_IMPORTED_MODULE_0_vue___default.a());

/***/ }),
/* 1 */
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
/* 2 */,
/* 3 */,
/* 4 */
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((values, history) => {
    values = history;

    if (values.length > 40) {
        values = values.slice(values.length - 40);
    }

    return values;
});

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
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

const Vue = __webpack_require__(2);
const bus = __webpack_require__(0);

Vue.use(__webpack_require__(6));
Vue.component("fan", __webpack_require__(14));
Vue.component("humidity", __webpack_require__(17));
Vue.component("temperature", __webpack_require__(24));

const app = new Vue({
    el: "#app",
    mounted() {
        const socket = io();
        this.$emit("socket:registered", socket);
    }
});

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bus__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_stateParser__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_historyManager__ = __webpack_require__(5);
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
    mounted() {
        this.$parent.$on("socket:registered", socket => {
            socket.on("fan:poll", response => {
                this.h = response.h;
                this.state = Object(__WEBPACK_IMPORTED_MODULE_1__utils_stateParser__["a" /* default */])(response.state);
                this.values = Object(__WEBPACK_IMPORTED_MODULE_2__utils_historyManager__["a" /* default */])(this.values, response.history);

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
            });
        });
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

var Component = __webpack_require__(1)(
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bus__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_stateParser__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_historyManager__ = __webpack_require__(5);
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
            h: -1
        };
    },
    components: {
        chart: __WEBPACK_IMPORTED_MODULE_0__chart_vue___default.a
    },
    mounted() {
        this.$parent.$on("socket:registered", socket => {
            socket.emit("humidity:init");

            socket.on("humidity:poll", response => {
                this.h = response.h;
                this.state = Object(__WEBPACK_IMPORTED_MODULE_2__utils_stateParser__["a" /* default */])(response.state);
                this.values = Object(__WEBPACK_IMPORTED_MODULE_3__utils_historyManager__["a" /* default */])(this.values, response.history);

                __WEBPACK_IMPORTED_MODULE_1__bus__["default"].$emit("humidity:chart:update", this.values);
            });
        });
    }
});

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_chartjs__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_chartjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_chartjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bus__ = __webpack_require__(0);




/* harmony default export */ __webpack_exports__["default"] = ({
    extends: __WEBPACK_IMPORTED_MODULE_0_vue_chartjs__["Line"],
    props: ["label", "step", "evt"],
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
                        beginAtZero: false
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
        this.options.scales.yAxes[0].ticks.stepSize = this.step;
        this.renderChart(this.chartdata, this.options);

        __WEBPACK_IMPORTED_MODULE_1__bus__["default"].$on(this.evt, data => {
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
      "step": "5",
      "evt": "humidity:chart:update"
    }
  })], 1)])
},staticRenderFns: []}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bus__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_stateParser__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_historyManager__ = __webpack_require__(5);
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
//






/* harmony default export */ __webpack_exports__["default"] = ({
    props: ["socket"],
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
    mounted() {
        this.$parent.$on("socket:registered", socket => {
            socket.emit("temperature:init");

            socket.on("temperature:poll", response => {
                this.f = response.f;
                this.c = response.c;
                this.state = Object(__WEBPACK_IMPORTED_MODULE_2__utils_stateParser__["a" /* default */])(response.state);
                this.values = Object(__WEBPACK_IMPORTED_MODULE_3__utils_historyManager__["a" /* default */])(this.values, response.history);

                __WEBPACK_IMPORTED_MODULE_1__bus__["default"].$emit("temperature:chart:update", this.values);
            });
        });
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
      "step": "1",
      "evt": "temperature:chart:update"
    }
  })], 1)])
},staticRenderFns: []}

/***/ })
],[9]);
//# sourceMappingURL=app.bundle.js.map