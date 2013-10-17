function isDate(obj) {
  return Object.prototype.toString.call(obj) === '[object Date]' ? 1 : 0;
}

describe('isDate()', function() {
  cases([undefined, null, 0, '', [], {}, function(){}])
  .it('0 return when arg is not Date', function(param) {
    expect(isDate(param)).toEqual(0);
  });

  it('1 return when arg is Date', function(param) {
    expect(isDate(new Date())).toEqual(1);
  });
});

function fizzbuzz(n) {
  if ((n % 15) == 0) {
    return 'fizzbuzz';
  } else if((n % 5) == 0) {
    return 'buzz';
  } else if((n % 3) == 0) {
    return 'fizz';
  }
  return n;
}

describe('fizzbuzz()', function() {
  cases([
    [3, 'fizz'],
    [5, 'buzz'],
    [7, 7],
    [9, 'fizz'],
    [15, 'fizzbuzz'],
  ])
  .it('sample', function(n, expected) {
    expect(fizzbuzz(n)).toEqual(expected);
  });
});

