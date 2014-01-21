var grunt = require('grunt'),
  removeCallsTask = require('../tasks/lib/remove-calls.js').init(grunt);

// Each item in the array is a test.
// The convention is:
// [
//    string to test,
//    options to pass to the remove-calls helper
//    expected result as string
// ]
var tests = [
  [
    'console.log(foo); bar; logger.warn("bar")',
    {
      namespaces: ['console', 'logger'],
      methods: ['log', 'warn']
    },
    ' bar; '
  ],
  [
    'console.log({ complex: "objects" }, [ "array" ])',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    ''
  ],
  [
    'console.log("foo (inner parens)")',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    ''
  ],
  [
    'logger.log("foo (inner parens)");foo;console.warn("(lol)")',
    {
      namespaces: ['console', 'logger'],
      methods: ['log', 'warn']
    },
    'foo;'
  ],
  [
    ';if(true){functionCall(function namedFun(){console.log("test", args);})}' +
      ';for(var x=1;x<foo.length;x++){fun(){console.warn("foo")}};',
    {
      namespaces: ['console'],
      methods: ['log', 'warn']
    },
    ';if(true){functionCall(function namedFun(){})};for(var x=1;x<foo.length;' +
      'x++){fun(){}};'
  ],
  [
    'console.log("foo");/*remove-calls:skip*/',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    'console.log("foo");/*remove-calls:skip*/'
  ],
  [
    'console.log("foo")/*remove-calls:skip*/',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    'console.log("foo")/*remove-calls:skip*/'
  ],
  [
    'bar;console.log("foo")/*remove-calls:skip*/',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    'bar;console.log("foo")/*remove-calls:skip*/'
  ],
  [
    'bar;console.log("foo")/*remove-calls:skip*/bar;',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    'bar;console.log("foo")/*remove-calls:skip*/bar;'
  ],
  [
    'bar;console.log("foo")/*remove-calls:skip*/;console.log("bar");',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    'bar;console.log("foo")/*remove-calls:skip*/;'
  ],
  [
    'bar;console.log("foo")/*remove-calls:skip*/;',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    'bar;console.log("foo")/*remove-calls:skip*/;'
  ],
  [
    'bar;console.log("foo") /*remove-calls:skip*/;foo;console.log("bar");',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    'bar;console.log("foo") /*remove-calls:skip*/;foo;'
  ],
  [
    'bar;console.log("foo") /* remove-calls:skip */;foo;console.log("bar");',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    'bar;console.log("foo") /* remove-calls:skip */;foo;'
  ],
  [
    'console.log("foo");/*remove-calls:skip*/console.log("bar");',
    {
      namespaces: ['console'],
      methods: ['log']
    },
    'console.log("foo");/*remove-calls:skip*/'
  ],
  [
    'bar;console.log("foo")/*remove-calls:skip*/;console.log("bar");' +
      'function(){console.warn("baz");}',
    {
      namespaces: ['console'],
      methods: ['log', 'warn']
    },
    'bar;console.log("foo")/*remove-calls:skip*/;function(){}'
  ],
  [
    'bar;console.log("foo")/*remove-calls:skip*/;console.log("bar");' +
      'function(){console.warn("baz");/*remove-calls:skip*/}',
    {
      namespaces: ['console'],
      methods: ['log', 'warn']
    },
    'bar;console.log("foo")/*remove-calls:skip*/;function(){' +
      'console.warn("baz");/*remove-calls:skip*/}'
  ],
  [
    'console.log("foo");that.log("foo");this.log("foo")',
    {
      namespaces: ['console', 'that', 'this'],
      methods: ['log']
    },
    ''
  ],
  [
    'console.log("foo");console.error("bar");console.warn("baz");',
    {
      namespaces: ['console'],
      methods: ['log', 'warn']
    },
    'console.error("bar");'
  ],
  [
    'console.log(foo);',
    {
      namespaces: ['console'],
      methods: ['log'],
      replaceWith: ''
    },
    ''
  ],
  [
    'console.log(foo)',
    {
      namespaces: ['console'],
      methods: ['log'],
      replaceWith: '0;'
    },
    '0;'
  ],
  [
    'console.warn("foo")',
    {
      namespaces: ['console'],
      methods: ['warn'],
      replaceWith: ''
    },
    ''
  ],
  [
    'console.warning("foo")',
    {
      namespaces: ['console'],
      methods: ['warning'],
      replaceWith: ''
    },
    ''
  ],
  [
    ' console.debug("foo")',
    {
      namespaces: ['console'],
      methods: ['debug'],
      replaceWith: ''
    },
    ' '
  ],
  [
    'console.info(\'foo\')',
    {
      namespaces: ['console'],
      methods: ['info'],
      replaceWith: ''
    },
    ''
  ],
  [
    'console.error()',
    {
      namespaces: ['console'],
      methods: ['error'],
      replaceWith: ''
    },
    ''
  ],
  [
    'console.log(arg1, arg2, "foo", arg4)',
    {
      namespaces: ['console'],
      methods: ['log'],
      replaceWith: ''
    },
    ''
  ],
  [
    'console.warn(foo)',
    {
      namespaces: ['console'],
      methods: ['warn'],
      replaceWith: ''
    },
    ''
  ],
  [
    'pre console.warn(foo); post',
    {
      namespaces: ['console'],
      methods: ['warn'],
      replaceWith: ''
    },
    'pre  post'
  ],
  [
    'pre logger.warn(foo) post',
    {
      namespaces: ['logger'],
      methods: ['warn'],
      replaceWith: ''
    },
    'pre post'
  ],
  [
    'pre logger.log(foo + bar) post',
    {
      namespaces: ['logger'],
      methods: ['log'],
      replaceWith: ''
    },
    'pre post'
  ],
  [
    'logger.emergency("Testing " + foo, bar);foo;',
    {
      namespaces: ['logger'],
      methods: ['emergency'],
      replaceWith: 'bar;'
    },
    'bar;foo;'
  ],
  [
    'logger && logger.log("hi")',
    {
      namespaces: ['logger'],
      methods: ['log'],
      replaceWith: '0;'
    },
    'logger && 0;'
  ],
  [
    'logger.log ("foo");',
    {
      namespaces: ['logger'],
      methods: ['log'],
      replaceWith: ''
    },
    ''
  ],
  [
    'pre;logger.log    ("foo");post;',
    {
      namespaces: ['logger'],
      methods: ['log'],
      replaceWith: ''
    },
    'pre;post;'
  ],
  [
    'logger.log ( "foo" );post',
    {
      namespaces: ['logger'],
      methods: ['log'],
      replaceWith: ''
    },
    'post'
  ],
  [
    'logger.log("foo") ;',
    {
      namespaces: ['logger'],
      methods: ['log'],
      replaceWith: ''
    },
    ''
  ],
  [
    'pre;logger.log("foo") ;post;',
    {
      namespaces: ['logger'],
      methods: ['log'],
      replaceWith: ''
    },
    'pre;post;'
  ]
];

/**
 * Test class.
 *
 * @type {object}
 */
exports.tests = {
  setUp: function(done) {
    done();
  },

  removeLogging: function(test) {
    test.expect(tests.length);

    tests.forEach(function(testOptions) {
      var result = removeCallsTask.apply(grunt, testOptions.slice(0, 2));
      test.equal(result.src, testOptions.slice(2));
    });

    test.done();
  }
};
