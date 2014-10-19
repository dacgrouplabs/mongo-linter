# mongo-linter

[![Build Status](https://magnum.travis-ci.com/dacgrouplabs/mongo-linter.svg?token=vja1SanqcFPypny4gPcZ&branch=master)](https://magnum.travis-ci.com/dacgrouplabs/mongo-linter)

Tool that connects to your [mongodb](https://www.mongodb.org/) database and runs [eslint](https://github.com/eslint/eslint) on all stored JavaScript functions. Helps developers detect potential issues and avoid head-scratching trying to figure out which stored js function is causing db.loadServerScripts() to fail -- mongo shell error messages do not tell you which function is the culprit.

## Installation

```
git clone https://github.com/dacgrouplabs/mongo-linter.git
```

Optionally, you can run `npm update` to grab the latest dependencies:
```
cd mongo-linter
npm update
```

## Usage


### Configure database connection string

First, you will need to configure your connection settings in `config.json`. The contents look like:
```
{
    "databaseUrl" : "mongodb://username:password@serverip:port/database?options"
}
```
Modify the `databaseUrl` value with your database connection info and credentials. mongo-linter will pass this connection string to the [MongoClient](http://mongodb.github.io/node-mongodb-native/) `connect` function.

The connection string should follow the format described in [the mongo connection string docs](http://docs.mongodb.org/manual/reference/connection-string/).

### Run mongo-linter

```
node .\mongo-linter.js
```

Output example:

```
PS C:\dev\mongo-linter> node .\mongo-linter.js
trying to connect...
connected.
retrieving all documents from system.js collection
documents returned: 1
start linting...

aggregateAllTheThings : 1 issues

================================================================================

function (sourceCollection, targetColleciton){
    [...]
}

================================================================================
[ { fatal: true,
    message: 'Unexpected token }',
    line: 13,
    column: 42 } ]

finished linting.
found 1 issues in 1 documents. :(
goodbye.
PS C:\dev\mongo-linter>
```


## Roadmap

0. Command line support for connection string as argument, fallback to config.json if no argument given
1. ~~Replace `mongojs` and use [mongodb](https://github.com/mongodb/node-mongodb-native/) native node driver instead~~ Done
2. ~~Hack away at writing jshint support for mongodb stored js env~~
3. Embed mongo-linter into shell or possibly hooked into mongodb system.js.save() event itself


## License

`mongo-linter`'s code in this repo uses the MIT license, see our LICENSE file.

## Contributing

Needs work
