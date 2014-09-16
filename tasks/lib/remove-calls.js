/**
 * Initialization method.
 *
 * @param {object} grunt Grunt variable.
 * @return {function} Method to initialize.
 */
exports.init = function(grunt) {
  return function(src, opts) {
    var _counter = 0,
      _src = src || '',
      _comment = '(//|/\\*|\\*)\\s*',
      _regExp, _commentRegExp;

    if (('namespaces' in opts) && ('methods' in opts)) {
      _regExp = new RegExp('(' + _comment + ')?(window.)?(' +
        opts.namespaces.join('|') + ')' + '.(?:' + opts.methods.join('|') +
          ')\\s{0,}\\([^;]*\\)(?!\\s*[;,]?\\s*\\/\\*\\s*remove-calls:skip\\s*' +
          '\\*\\/)\\s{0,};?', 'g');
      _commentRegExp = new RegExp('^' + _comment);

      _src = _src.replace(_regExp, function(match) {
        var result = match;

        if (!_commentRegExp.test(match)) {
          _counter++;
          result = opts.replaceWith || '';
        }

        return result;
      });
    }

    return {
      src: _src,
      count: _counter
    };
  };
};
