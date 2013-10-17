describe('jasmine_parameterize', function() {
  var target;
  beforeEach(function() {
    target = jasmine_parameterize;
  });

  describe('._validate()', function() {
    it('true is returned when has "jasmine" property', function() {
      var context = {jasmine: {}}
      expect(target._validate(context)).toBeTruthy();
    });

    it('throw error when has not "jasmine" property', function() {
      var msg = 'jasmine-parameterize: Not found jasmine.';
      expect(function(){target._validate({})}).toThrow(msg);
      expect(function(){target._validate(undefined)}).toThrow(msg);
      expect(function(){target._validate(null)}).toThrow(msg);
    });
  });

  describe('._buildSpecName()', function() {
    var index = 0; // increment for test cases
    var obj = {};
    obj.constructor = null;

    cases([
      [undefined, 'undefined'],
      [null, 'null'],
      [1, '1'],
      [['a', 2], '"a", 2'],
      [[], '[]'],
      [[[1]], '[1]'],
      [[[1, 2, ['a']]], '[1, 2, ["a"]]'],
      [function foo() {}, '[object Function]foo'],
      [function() {}, '[object Function]'],
      [{}, '[object Object]Object'],
      [jasmine_parameterize, '[object Object]JasmineParameterize'],
      [new Date(), '[object Date]Date'],
      [obj, '[object Object]'],
    ])
    .it('the present param is attached to a name', function(input, str) {
      var arg = input instanceof Array ? input : [input];
      var expected = 'cases[' + index + '] - (' + str + ')'
      expect(target._buildSpecName(index, arg)).toEqual(expected);
      index++;
    });
  });
});

describe('cases()', function() {
  describe('throw error', function() {
    it('params not array', function(param) {
      var msg = 'jasmine-parameterize: Required array for cases(). params=';
      expect(function(){cases("")}).toThrow(msg + '');
      expect(function(){cases({})}).toThrow(msg + '[object Object]');
      expect(function(){cases(0)}).toThrow(msg + '0');
      expect(function(){cases(function() {})}).toThrow(msg + 'function () {}');
      expect(function(){cases(undefined)}).toThrow(msg + 'undefined');
      expect(function(){cases(null)}).toThrow(msg + 'null');
      expect(function(){cases()}).toThrow(msg + 'undefined');
    });

    it('params is empty', function(param) {
      var msg = 'jasmine-parameterize: Params is empty';
      expect(function(){cases([])}).toThrow(msg);
    });
  });

  describe('.it()', function() {
    describe('single element', function() {
      var i = 0;
      var data = [10, 20, 30];
      cases(data)
      .it('it is passed in order', function(param) {
        expect(param).toEqual(data[i++]);
      });
    });

    describe('multiple elements', function() {
      cases([
        ['a', 'A'],
        ['b', 'B'],
        ['c', 'C'],
      ])
      .it('it is passed in order', function(first, second) {
        expect(first.toUpperCase()).toEqual(second);
      });
    });
  });

  describe('.xit()', function() {
    cases([undefined, null, 1, 'a'])
    .xit('it is skipped', function(v) {
      // This is not in agreement.
      // However, it is not failure.
      // It is because it is skipped by xit.
      expect(1).toEqual(0);
    });
  });
});
