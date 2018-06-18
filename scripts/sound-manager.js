define("scripts/sound-manager.js", function(exports, require, module) {
  "use strict";

  var sound = require("scripts/sound");
  var random = require("scripts/tools").randomNumber;

  var soundArrays = {
    "frog": 1,
    "bun": 2,
    "gameover": 1,
    "start": 1
  };

  var bgm;

  function loadArrays() {
    var arr, count, src;
    for (var name in soundArrays) {
      arr = [];
      count = soundArrays[name];
      for (var i = 0; i < count; i++) {
        arr.push(sound.create("sounds/" + name + (i + 1) + ".mp3"));
      }
      soundArrays[name] = arr;
    }
  }

  exports.init = function() {
    loadArrays();
    bgm = sound.create("sounds/bgm.mp3");
    bgm.setLoop(true);
  };

  exports.play = function(name) {
    var arr = soundArrays[name];
    var len = arr.length;
    return arr[len == 1 ? 0 : random(len)].play();
  };

  exports.playBgm = function() {
    bgm.setVolume(80);
    return bgm.resume();
  };

  exports.stopBgm = function() {
    bgm.fadeTo(0, 1e3, function() {
      bgm.pause();
    });
  };

});
