// mongo-linter.js
var config = require('./config.json'),
    Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert'),
    linter = require("eslint").linter;

console.log("trying to connect...");
var mongoclient = MongoClient.connect(config.databaseUrl, function(err, db) {
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
                console.log("system.js collection doesn't exist in this db for some odd reason");
            } else {
                console.log("retrieving all documents from system.js collection");
                storedjsCollection.find({}, {
                    sort: {
                        "_id": 1
                    }
                }).toArray(function(err, docs) {
                    if (err) {
                        console.log("error retrieving stored javascript from system.js collection...");
                        throw err;
                    } else {
                        console.log("documents returned: " + docs.length);
                        console.log("start linting...");
                        console.log();

                        var documentsWithIssues = 0;
                        var totalIssues = 0;

                        docs.forEach(function(doc) {

                            var messages = linter.verify("var " + doc._id + " = " + doc.value.code, {});

                            if (messages.length > 0) {
                                console.log(doc._id + " : " + messages.length + " issues");
                                console.log("");
                                console.log("================================================================================");
                                console.log("");
                                console.log(doc.value.code);
                                console.log("");
                                console.log("================================================================================");
                                console.log(messages);

                                documentsWithIssues++;
                                totalIssues = totalIssues + messages.length;
                            } else {
                                console.log(doc._id + " : OK");
                            }

                        });

                        console.log("");
                        console.log("finished linting.");

                        if (documentsWithIssues == 0) {
                            console.log("no issues found. congrats!");
                        } else {
                            console.log("found " + totalIssues + " issues in " + documentsWithIssues + " documents. :(");
                        }

                        db.close();
                        console.log("goodbye.");
                    }
                });
            }
        });
    }
});