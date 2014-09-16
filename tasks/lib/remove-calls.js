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
      _regExp;

    if (('namespaces' in opts) && ('methods' in opts)) {
      _regExp = new RegExp('^(?!/(/|\\*))\\s*(window.)?(' +
        opts.namespaces.join('|') + ')' + '.(?:' + opts.methods.join('|') +
          ')\\s{0,}\\([^;]*\\)(?!\\s*[;,]?\\s*\\/\\*\\s*remove-calls:skip\\s*' +
          '\\*\\/)\\s{0,};?', 'gi');

      _src = _src.replace(_regExp, function() {
        _counter++;
        return opts.replaceWith || '';
      });
    }

    return {
      src: _src,
      count: _counter
    };
  };
};
