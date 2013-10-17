(function (global) {

    // Must load jasmine to use this plugin
    if (!global.jasmine) throw new Error('jasmine-rowtests: Requires jasmine to run.');

    global.given = function (testData) {
        /// <summary>
        /// Run a single spec with multiple input data sets. Chain the "it" function onto the result.
        /// i.e. 
        ///            given([
        ///         ['hello', 'world'], 
        ///                ['foo', 'bar']
        ///            ])
        ///     .it('should do something with param1 and param2', function(param1, param2) {
        ///                ... 
        ///            });
        /// </summary>
        /// <param name="testData">An array of arrays of data. Each inner array will be applied as parameters
        /// to the spec function.</param>
        if (!testData || !testData.length)
            throw new Error('No data provided for given()');

        function getSpecName(name, params) {
            return 'given (' + getParamNames(params) + ') - ' + name;
        }

        function getTestFunction(func, data) {
            // Warning: Closure Voodoo
            return function () { func.apply(global, data); };
        }

        function getParamNames(params) {
            var results = new Array();
            for (var i = 0; i < params.length; i++) {
                var value = params[i];
                results.push(
                    typeof value === 'undefined' ? 'undefined'
                        : value === null ? 'null'
                            : typeof value === 'function' ? 'function(){...}'
                                : typeof value === 'string' ? "'" + value + "'"
                                    : value.toString());
            }
            return results.join(', ');
        }

        return {
            it: function (description, func) {
                for (var i = 0; i < testData.length; i++) {
                    var currentData = testData[i] != null && testData[i].push && testData[i].length > 0 ? testData[i] : [testData[i]],
                        currentSpecName = getSpecName(description, currentData),
                        functionWithData = getTestFunction(func, currentData);

                    global.it(currentSpecName, functionWithData);
                }
            },
            xit: function (description, func) {
            }
        };
    };
})(window);


describe("is_date()", function() {
  it("愚直に書く", function() {
    expect(is_date(undefined)).toEqual(0);
    expect(is_date(null)).toEqual(0);
    expect(is_date(0)).toEqual(0);
    expect(is_date('')).toEqual(0);
    expect(is_date([])).toEqual(0);
    expect(is_date({})).toEqual(0);
    expect(is_date(function(){})).toEqual(0);
    expect(is_date(new Date())).toEqual(1);
  });

  var parameters = [
    undefined, null, 0, '', [], {}, function(){}
  ];
  parameters.forEach(function(param) {
    it(param + ' が渡されたら0を返す', function() {
      expect(is_date(param)).toEqual(0);
    });
  });

  given([undefined, null, 0])
  .it("いい感じに", function(param) {
    expect(is_date(param)).toEqual(0);
  });
});
