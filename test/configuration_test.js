var expect = require('expect.js');

describe('Configuration', function(){
  var config = require('../config.json');

  describe('databaseUrl', function(){
    it('should contain a databaseUrl key', function(){
      expect(config.databaseUrl).not.to.be(undefined);
    });

    it('should match the format of mongodb://username:password@serverip:port/database', function() {
      expect(config.databaseUrl).to.match(/^mongodb:\/\/([\.\-\w]+):([\.\-\w]+)@([\.\-\w]+):(\d+)\/([\.\-\w]+)/);
    });
  })
})