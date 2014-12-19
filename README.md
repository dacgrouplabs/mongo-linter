# mongo-linter

[![Build Status](https://magnum.travis-ci.com/dacgrouplabs/mongo-linter.svg?token=vja1SanqcFPypny4gPcZ&branch=master)](https://magnum.travis-ci.com/dacgrouplabs/mongo-linter)

Tool that connects to your [mongodb](https://www.mongodb.org/) database and runs [jshint](http://www.jshint.com/docs/) on all stored JavaScript functions. Helps developers detect potential issues and avoid head-scratching trying to figure out which stored js function is causing db.loadServerScripts() to fail -- mongo shell error messages do not tell you which function is the culprit.

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
First, copy the provided `config.json.sample` to `config.json` and provide a valid `databaseUrl` value.

``` json
{
    "databaseUrl" : "username:password@serverip:port/database"
}
```

The connection string should follow the format described in [the mongo connection string docs](http://docs.mongodb.org/manual/reference/connection-string).

### Run mongo-linter

```
node .\mongo-linter.js
```

Output example:

```
PS C:\dev\mongo-linter> node .\mongo-linter.js
Connecting...
2 errors in function aggregateAllTheThings


Globals:
    undefined
    Array
    Object
-----------------------------------------
Total errors: 2
Suppressed errors: 2
Remaining errors: 0
PS C:\dev\mongo-linter>
```


## Roadmap

0. Command line support for connection string as argument, fallback to config.json if no argument given
1. Replace `mongojs` and use [mongodb](https://github.com/mongodb/node-mongodb-native/) native node driver instead
2. Hack away at writing jshint support for mongodb stored js env
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

`mongo-linter`'s code in this repo uses the MIT license, see our LICENSE file.

## Contributing

Needs work