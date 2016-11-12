var child_process = require('child_process');
var http = require('http');

var ex = module.exports = function(options) {
  if (options === undefined) {
    options = {};
  }

  doptions = {
    player: '/usr/bin/cvlc',
    interface: 'http',
    httpPort: '8080',
    httpPassword: 'secret'
  };

  // set the default values, incase they are not provided
  options = Object.assign(doptions, options);

  var args = [];

  if (options.interface !== undefined) {
    args.push('-I');
    args.push(options.interface);
  }

  if (options.httpPort !== undefined) {
    args.push('--http-port');
    args.push(options.httpPort);
  }

  if (options.httpPassword !== undefined) {
    args.push('--http-password');
    args.push(options.httpPassword);
  }

  var player = child_process.spawn(options.player, args);

  if (options.log !== undefined) {
    player.stdout.on('data', function(data) {
      options.log(data);
    });

    player.stderr.on('data', function(data) {
      options.log(data);
    });
  }

  if (options.logToConsole) {
    player.stdout.on('data', function(data) {
      console.log('[node-vlc-json] ' + data);
    });

    player.stderr.on('data', function(data) {
      console.log('[node-vlc-json] ' + data);
    });
  }

  return {
    options: options,
    _player: player,
    close: function() {
      player.kill();
    },
    isPlaying: function(cb) {
      this.status(function(res) {
        cb(res !== undefined && res !== null && res.state === 'playing');
      });
    },
    pause: makeStdCall(options, 'pl_pause'),
    next: makeStdCall(options, 'pl_next'),
    previous: makeStdCall(options, 'pl_previous'),
    play: function(media, cb) {
      if (cb === undefined) {
        stdCall(options, 'pl_play', {}, media);
      } else {
        stdCall(options, 'in_play', {
          input: media
        }, cb);
      }
    },
    stop: function(cb) {
      stdCall(options, 'pl_stop', {}, cb);
    },
    pause: function(cb) {
      stdCall(options, 'pl_pause', {}, cb);
    },
    status: function(cb) {
      stdCall(options, undefined, {}, function(res) {
        var full = '';

        res.on('data', function(data) {
          full += data.toString();
        });

        res.on('end', function(e) {
          cb(JSON.parse(full));
        });
      });
    }
  };
};

/**
 * Do a standard call on the VLC API.
 * @param  {options}  options
 * @param  {string}   call
 * @param  {array}    args
 * @param  {Function} cb
 */
function stdCall(options, call, args, cb) {
  var val = '';

  for (var key in args) {
    val += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
  }

  if (call !== undefined) {
    call = '?command=' + call;
  }

  if (call === undefined) {
    call = '';
  }

  if (val === undefined) {
    val = '';
  }

  http.get({
    hostname: 'localhost',
    port: options.httpPort,
    path: '/requests/status.json' + call + val,
    auth: ':' + options.httpPassword,
    agent: false
  }, function(res) {
    cb(res);
  });
}

function makeStdCall(options, call) {
  return function(cb) {
    stdCall(options, call, {}, cb);
  };
}
