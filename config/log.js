/*
    Bold	        \x1B[1m
    Faint	        \x1B[2m
    Italic	        \x1B[3m
    Underlined	    \x1B[4m
    Inverse	        \x1B[7m
    StrikeThrough	\x1B[9m
*/
/** @example 'Attention: only accept string value' */
var l = {
  /** màu đỏ #000 */
  black:      function () { console.log('\x1b[30m', ...arguments, '\x1b[0m') },
  red:        function () { console.log('\x1b[31m', ...arguments, '\x1b[0m') },
  green:      function () { console.log('\x1b[32m', ...arguments, '\x1b[0m') },
  yellow:     function () { console.log('\x1b[33m', ...arguments, '\x1b[0m') },
  blue:       function () { console.log('\x1b[34m', ...arguments, '\x1b[0m') },
  Magenta:    function () { console.log('\x1b[35m', ...arguments, '\x1b[0m') },
  cyan:       function () { console.log('\x1b[36m', ...arguments, '\x1b[0m') },
  White:      function () { console.log('\x1b[37m', ...arguments, '\x1b[0m') },

  error:      function () { console.log('\x1b[31m', ...arguments, '\x1b[0m') }, // ~ red

  log:        function () { console.log(...arguments) },
  
  // rgb:        function () { console.log()},
  // ... => 30-35, 90-95, 100-106
}

// let message = 'this is a message'

// \x1B[38;2;R;G;Bm // R,G,B : [0, 255]
// console.log(`\x1B[38;2;255;97;39m`, message)

// \x1B[38;5;Vm // V: [0, 255]
// console.log('\x1B[38;5;8m', message)
module.exports = l