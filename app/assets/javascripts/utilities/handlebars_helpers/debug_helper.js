/* jshint ignore:start */
Handlebars.registerHelper("debug", function(optionalValue) {

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  console.log(out);
}

  console.log("Current Context");
  console.log("===============");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});
/* jshint ignore:end */