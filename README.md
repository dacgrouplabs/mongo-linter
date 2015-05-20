# mongo-linter

[![Build Status](https://travis-ci.org/dacgrouplabs/mongo-linter.svg?branch=devel)](https://travis-ci.org/dacgrouplabs/mongo-linter)

Tool written in [Node.js](https://nodejs.org/) that connects to your [mongodb](https://www.mongodb.org/) database and runs [eslint](https://github.com/eslint/eslint) on all stored JavaScript functions. Helps developers detect potential issues and avoid head-scratching trying to figure out which stored js function is causing db.loadServerScripts() to fail -- mongo shell error messages do not tell you which function is the culprit. For example:

```
> db.loadServerScripts();
2015-05-08T14:59:28.094+0000 SyntaxError: Unexpected token ;
2015-05-08T14:59:28.099+0000 Error: 16722 SyntaxError: Unexpected token ; at src/mongo/shell/db.js:895
>
```

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


### Database URI configuration

First, copy the provided `config.json.sample` to `config.json` and provide a valid `databaseUrl` value.

``` json
{
    "databaseUrl" : "mongodb://username:password@serverip:port/database?options"
}
```

The connection string should follow the format described in [the mongo connection string docs](http://docs.mongodb.org/manual/reference/connection-string).

### ESLint Rules Configuration

Copy the provided `rules.json.sample` to `rules.json` and update the *rules* entry with the rules you'd like applied to your Javascript functions.

For example:

``` json
{
  "rules": {
    "eqeqeq": 0,
    "no-bitwise": 1,
    "curly": [2, "multi"],
    "quotes": [2, "double"]
  }
}
```

Since [ESLint](http://eslint.org) is being used as the internal linter, please refer to the [ESLint Rules](http://eslint.org/docs/rules) page for all available options.

### Run mongo-linter

```
node mongo-linter.js
```
or:
```
node mongo-linter.js --url=mongodb://username:password@serverip:port/database?options
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

0. ~~Command line support for connection string as argument, fallback to config.json if no argument given~~ Done
1. ~~Replace `mongojs` and use [mongodb](https://github.com/mongodb/node-mongodb-native/) native node driver instead~~ Done
2. ~~Hack away at writing jshint support for mongodb stored js env~~
3. Embed mongo-linter into shell or possibly hooked into mongodb system.js.save() event itself

## Testing

The test suite can be run using [mocha](https://github.com/mochajs/mocha).

```
$ mocha

  Configuration
    databaseUrl
      ✓ should contain a databaseUrl key 
      ✓ should match the format of username:password@serverip:port/database 


  2 passing (14ms)
```

## License

see [LICENSE](LICENSE).

## Contributing

Want to contribute? Great!

1. Fork it.
2. Create a branch (`git checkout -b my_branch`)
3. Commit your changes (`git commit -am "Added funktastic feature!"`)
4. Push to the branch (`git push origin my_branch`)
5. Open a [Pull Request][1]

[1]: https://github.com/dacgrouplabs/mongo-linter/pulls
