function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]" ? 1 : 0;
}
