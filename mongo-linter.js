// mongo-linter.js
var config = require('./config.json');
var jshint = require("jshint").JSHINT;
var mongojs = require("mongojs");

var databaseUrl = config.databaseUrl;
var collections = ["users", "system.js"];
console.log("Connecting...");
var db = mongojs.connect(databaseUrl, collections);
var totalErrors = 0;
var suppressedErrors = 0;

db.system.js.find({ }, { } , { /*limit: 10*/}, function(err, storedjsArray) {
  if( !storedjsArray) console.log("No stored JavaScript functions found");
  else if (err) console.log(err);
  else {
//    console.log(storedjsArray.value.code);

      storedjsArray.forEach( function(storedjs) {
        //console.log(storedjs.value.code);
        var options = {
            "eqeqeq" : false,
            "eqnull" : false,
            "laxbreak" : true,
            "sub" : true
        };

        var globals = {};

        if(jshint(storedjs.value.code.toString(), options, globals)) {
            console.log('Function ' + storedjs._id + ' has no errors.  Congrats!');
        } else {
            var out = jshint.data(),
                errors = out.errors;
            console.log(errors.length + ' errors in function ' + storedjs._id);
            console.log('');

            for(var j=0;j<errors.length;j++) {
                if (errors[j].code.substring(0, 1)=='W') {
                // if (errors[j].code=='W025' ||
                    // errors[j].code=='W041') {

                    suppressedErrors++;
                }
                else {
                    console.log(errors[j].line + ':' + errors[j].character + ' (' + errors[j].code + ') -> ' + errors[j].reason + ' -> ' + errors[j].evidence);
                }

                totalErrors++;
            }

            // List globals
            console.log('');
            console.log('Globals: ');
            for(j=0;j<out.globals.length;j++) {
                console.log('    ' + out.globals[j]);
            }
        }
        console.log('-----------------------------------------');
      } );

      console.log('Total errors: ' + totalErrors);
      console.log('Suppressed errors: ' + suppressedErrors);
      console.log('Remaining errors: ' + (totalErrors - suppressedErrors));
  }

  db.close();
  process.exit();
});
