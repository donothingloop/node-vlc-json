# node-vlc-json [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Control VLC by using its JSON API

## Installation

```sh
$ npm install --save node-vlc-json
```

## Usage

```js
var VLC = require('node-vlc-json');
var player = new VLC();

player.play('http://example.com/my_media.mp4', function() {
  player.status(function(res) {
    console.log(res.state);
  });
});
```

The following functions are exposed:

```js
player.play(media, cb);       // play a media file or stream
player.play(cb);              // continue playing
player.pause(cb);             // pause the playback
player.stop(cb);              // stop the current playback
player.close();               // terminate the player
player.next(cb);              // skip to the next media in the playlist
player.previous(cb);          // skip to the previous media in the playlist
player.isPlaying(cb);         // callback called with bool that indicates the playback state
player.status(cb);            // callback called with the status of the VLC player
player.snapshot(cb);          // take a snapshot and save it to snapshotPath
```

## Options
The constructor of *VLC* accepts this options:
- interface
- httpPort
- httpPassword
- snapshotPath
- vout
- aout
- disableDbusControl

[npm-image]: https://badge.fury.io/js/node-vlc-json.svg
[npm-url]: https://npmjs.org/package/node-vlc-json
[travis-image]: https://travis-ci.org/donothingloop/node-vlc-json.svg?branch=master
[travis-url]: https://travis-ci.org/donothingloop/node-vlc-json
[daviddm-image]: https://david-dm.org/donothingloop/node-vlc-json.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/donothingloop/node-vlc-json
