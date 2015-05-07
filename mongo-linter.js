// mongo-linter.js
var argv = require('minimist')(process.argv.slice(2)),
    rules  = require('./rules.json') || {},
    MongoClient = require('mongodb').MongoClient,
    linter = require("eslint").linter;

var config = {};
if (argv.url)
    config.databaseUrl = argv.url;
else
    config = require('./config.json');

console.log("trying to connect...");
MongoClient.connect(config.databaseUrl, function(err, db) {
    if (err) {
        console.log("error establishing connection.");
        throw err;
    } else {
        console.log("connected.")
        // get the system.js collection in safe mode
        db.collection("system.js", {
            strict: true
        }, function(err, storedjsCollection) {
            if (err) {
                console.log("could not find system.js collection in this db.");
                console.log("closing connection.");
                db.close();
            } else {
                console.log("retrieving all documents from system.js collection");
                storedjsCollection.find({}, { sort: { "_id": 1 } }).toArray(function(err, docs) {
                    if (err) {
                        console.log("error retrieving stored javascript from system.js collection...");
                        throw err;
                    } else {
                        console.log("documents returned: " + docs.length);
                        console.log("start linting...\n");

                        var documentsWithIssues = 0, totalIssues = 0;

                        docs.forEach(function(doc) {
                            var messages = linter.verify("var " + doc._id + " = " + doc.value.code, rules);

                            if (messages.length > 0) {
                                console.log("\033[31m X \033[0m" + doc._id + " : " + messages.length + " issues");
                                console.log("\n================================================================================\n");
                                console.log(doc.value.code);
                                console.log("\n================================================================================\n");
                                console.log(messages);

                                documentsWithIssues++;
                                totalIssues = totalIssues + messages.length;
                            } else {
                                console.log("\033[32m ✓ \033[0m" + doc._id);
                            }
                        });

                        var completedMessage = "linting completed with %d issue(s)"
                        if (documentsWithIssues == 0)
                            console.log(completedMessage, totalIssues);
                        else
                            console.log(completedMessage + " in %d documents.", totalIssues, documentsWithIssues);

                        console.log("closing connection.");
                        db.close();
                    }
                });
            }
        });
    }
});