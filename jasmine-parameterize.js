/*
 * JasmineParameterize v 1.0
 * A jasmine plugin for running parameterized tests
 * https://github.com/kannokanno/jasmine-parameterize
 * Released under the MIT license.
 */

var jasmine_parameterize = (function() {
  "use strict";

  function JasmineParameterize() {}

  JasmineParameterize.prototype._casesFunc = function(context) {
    var that = this;
    return function(params) {
      if (notArray(params)) {
        error('Required array for cases(). params=' + params);
      } else if (params.length < 1) {
        error('Params is empty');
      }

      return {
        it: function(name, func) {
          that._run(context, name, func, params, context.it);
        },
        xit: function(name, func) {
          that._run(context, name, func, params, context.xit);
        }
      };
    }
  }

  JasmineParameterize.prototype._run = function(context, name, func, params, action) {
    var wrapFunc = function(context, func, args) {
      return function() {
        func.apply(context, args);
      };
    }

    var that = this;
    context.describe(name, function() {
      var n = params.length;
      for (var i = 0; i < n; i++) {
        var value = params[i];
        var param = isArray(value) ? value : [value];
        action.call(context, that._buildSpecName(i, param, name), wrapFunc(context, func, param));
      }
    });
  }

  JasmineParameterize.prototype._validate = function(context) {
    if (notExist(context) || notExist(context.jasmine)) {
      error('Not found jasmine.');
    }
    return true;
  }

  JasmineParameterize.prototype._buildSpecName = function(index, params, name) {
    var str = params.length > 0 ? joinParams(params) : '[]';
    if (name.indexOf('$case') > 0) {
      name = name.replace('$case', str);
    }
    else {
      name = name + '---' + str;
    }
    return name;
  }

  function error(msg) {
    throw new Error('jasmine-parameterize: ' + msg);
  }

  function isExist(v) {
    return typeof(v) !== 'undefined' && v !== null;
  }

  function notExist(v) {
    return !isExist(v);
  }

  function isArray(value) {
    return value !== null && value instanceof Array;
  }

  function notArray(value) {
    return !isArray(value);
  }

  function joinParams(params) {
    var r = [];
    for (var i = 0; i < params.length; i++) {
      r.push(getParamString(params[i]));
    }
    return r.join(', ');
  }

  function getParamString(param) {
    var type = typeof param;
    var typeName = Object.prototype.toString.call(param);
    if (type === 'undefined') {
      return 'undefined';
    } else if (param === null) {
      return 'null';
    } else if (type === 'string') {
      return '"' + param + '"';
    } else if (type === 'number') {
      return param;
    } else if (type === 'boolean') {
      return param;
    } else if (param instanceof Array) {
      // recursive
      return param.length > 0 ? '[' + joinParams(param) + ']' : '[]';
    } else if (type === 'function' && isExist(param.name)) {
      return typeName + param.name;
    } else if (isExist(param.constructor) && isExist(param.constructor.name)) {
      return typeName + param.constructor.name;
    }
    return typeName;
  }

  return new JasmineParameterize();
})();

(function(global) {
  "use strict";
  jasmine_parameterize._validate(global);
  global.cases = jasmine_parameterize._casesFunc(global);
})(typeof window === 'undefined' ? this : window);
