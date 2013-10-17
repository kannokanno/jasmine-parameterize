// Generated by CoffeeScript 1.3.3
(function() {
  var page, system, waitFor;

  system = require('system');

  waitFor = function(testFx, onReady, timeOutMillis) {
    var condition, f, interval, start;
    if (timeOutMillis == null) {
      timeOutMillis = 3000;
    }
    start = new Date().getTime();
    condition = false;
    f = function() {
      if ((new Date().getTime() - start < timeOutMillis) && !condition) {
        return condition = (typeof testFx === 'string' ? eval(testFx) : testFx());
      } else {
        if (!condition) {
          console.log("'waitFor()' timeout");
          return phantom.exit(1);
        } else {
          if (typeof onReady === 'string') {
            eval(onReady);
          } else {
            onReady();
          }
          return clearInterval(interval);
        }
      }
    };
    return interval = setInterval(f, 100);
  };

  if (system.args.length !== 2) {
    console.log('Usage: run-jasmine.coffee URL');
    phantom.exit(1);
  }

  page = require('webpage').create();

  page.onConsoleMessage = function(msg) {
    return console.log(msg);
  };

  page.open(system.args[1], function(status) {
    if (status !== 'success') {
      console.log('Unable to access network');
      return phantom.exit(1);
    } else {
      page.evaluate(function() {
        var original;
        original = jasmine.ExpectationResult;
        jasmine.ExpectationResult = function(params) {
          original.apply(this, [params]);
          if (!this.passed_ && !(this.trace.stack != null)) {
            try {
              throw new Error(this.message);
            } catch (e) {
              this.trace = e;
              return null;
            }
          }
        };
        jasmine.ExpectationResult.prototype = original.prototype;
        window.COLOR_ES = {
          "black": "\x1b[30m",
          "red": "\x1b[31m",
          "green": "\x1b[32m",
          "yellow": "\x1b[33m",
          "blue": "\x1b[34m",
          "magenta": "\x1b[35m",
          "cyan": "\x1b[36m",
          "white": "\x1b[37m",
          "default": "\x1b[39m"
        };
        return window.logWithColor = function(log, color) {
          if (!COLOR_ES[color]) {
            console.log(log);
            return;
          }
          return console.log("" + COLOR_ES[color] + log + COLOR_ES['default']);
        };
      });
      return waitFor(function() {
        return page.evaluate(function() {
          return document.body.querySelector('.symbolSummary .pending') === null;
        });
      }, function() {
        var exitCode;
        exitCode = page.evaluate(function() {
          var el, failsCount, i, index, line, list, specsCount, stackTrace, _i, _j, _len, _len1, _ref;
          console.log(document.body.querySelector('.jasmine_reporter .duration').innerText);
          specsCount = document.body.querySelectorAll(".symbolSummary li").length;
          failsCount = document.body.querySelectorAll('.symbolSummary li.failed').length;
          if (failsCount === 0) {
            logWithColor("" + specsCount + " examples, 0 failures", 'green');
            return 0;
          }
          logWithColor("" + specsCount + " examples, " + failsCount + " failures", 'red');
          console.log("\nFailures:\n");
          list = document.body.querySelectorAll('.results > #details > .specDetail.failed');
          for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
            el = list[i];
            logWithColor("  " + (i + 1) + ") " + (el.querySelector('.description').innerText));
            logWithColor("    " + (el.querySelector('.resultMessage.fail').innerText), 'red');
            if (el.querySelector('.stackTrace')) {
              stackTrace = [];
              _ref = el.querySelector('.stackTrace').innerText.split(/\n/);
              for (index = _j = 0, _len1 = _ref.length; _j < _len1; index = ++_j) {
                line = _ref[index];
                if (index === 0) {
                  continue;
                }
                if (line.indexOf("__JASMINE_ROOT__") !== -1) {
                  continue;
                }
                if (line.indexOf("/lib/jasmine-1.2.0/jasmine.js") !== -1) {
                  continue;
                }
                if (line.indexOf("phantomjs://webpage.evaluate") !== -1) {
                  continue;
                }
                logWithColor("    " + line, 'cyan');
              }
            }
            console.log("");
          }
          return 1;
        });
        return phantom.exit(exitCode);
      });
    }
  });

}).call(this);