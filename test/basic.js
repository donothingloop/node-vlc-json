var assert = require('assert');
var VLC = require('../');

var testmedia = 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v';

describe('vlc-json', function() {
  var player = new VLC();

  it('should create a vlc process when instantiated', function(done) {
    this.timeout(10000);

    // wait for the player to start
    setTimeout(function() {
      assert.notEqual(player._player, null);
      assert.notEqual(player._player, undefined);
      assert.equal(player._player.killed, false);
      done();
    }, 6000);
  });

  it('should return the VLC status', function(done) {
    player.status(function(res) {
      done();
    });
  });

  it('should start playing after a play command', function(done) {
    this.timeout(10000);

    player.play(testmedia, function() {
      setTimeout(function() {
        player.status(function(res) {
          assert.equal(res.state, 'playing');

          player.isPlaying(function(is) {
            assert.equal(is, true);
            done();
          });
        });
      }, 4000);
    });
  });

  it('should stop the playback after a stop command', function(done) {
    this.timeout(10000);
    player.stop(function() {
      setTimeout(function() {
        player.status(function(res) {
          assert.equal(res.state, 'stopped');

          player.isPlaying(function(is) {
            assert.equal(is, false);
            done();
          });
        });
      }, 2000);
    });
  });

  it('should resume the playback', function(done) {
    this.timeout(6000);
    player.play(function() {
      setTimeout(function() {
        player.status(function(res) {
          assert.equal(res.state, 'playing');

          player.isPlaying(function(is) {
            assert.equal(is, true);
            done();
          });
        });
      }, 4000);
    });
  });

  it('should pause the playback', function(done) {
    this.timeout(6000);
    player.pause(function() {
      setTimeout(function() {
        player.status(function(res) {
          assert.equal(res.state, 'paused');

          player.isPlaying(function(is) {
            assert.equal(is, false);
            done();
          });
        });
      }, 1000);
    });
  });

  it('should stop the player process on close', function(done) {
    this.timeout(10000);

    player.close();

    // wait for the player to start
    setTimeout(function() {
      assert.equal(player._player.killed, true);
      done();
    }, 3000);
  });
});
