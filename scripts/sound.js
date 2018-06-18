define("scripts/sound.js", function(exports, require, module) {
  "use strict";

  function ClassSound(src) {
    this.sound = document.createElement("audio");
    var source = document.createElement("source");
    source.src = src;
    this.sound.appendChild(source);
    this.sound.preload = "auto";
    this.setVolume(100);
  }

  ClassSound.prototype.play = function() {
    this.sound.currentTime = 0;
    return this.sound.play();
  };

  ClassSound.prototype.stop = function() {
    this.sound.currentTime = 0;
    this.sound.pause();
  };

  ClassSound.prototype.pause = function() {
    this.sound.pause();
  };

  ClassSound.prototype.resume = function() {
    return this.sound.play();
  };

  ClassSound.prototype.setVolume = function(volume) {
    if (volume < 0) {
      volume = 0;
    }
    if (volume > 100) {
      volume = 100;
    }
    this.volume = volume;
    this.sound.volume = volume / 100;
  };

  ClassSound.prototype.getVolume = function() {
    return this.volume;
  };

  ClassSound.prototype.fadeTo = function(to, duration, callback) {
    var from = this.volume;
    var delay = duration / Math.abs(from - to);
    var that = this;
    function doFade() {
      setTimeout(function() {
        if (from < to && that.volume < to) {
          that.setVolume(that.volume += 1);
          doFade();
        } else if (from > to && that.volume > to) {
          that.setVolume( that.volume -= 1 );
          doFade();
        } else if (callback instanceof Function) {
          callback.apply(that);
        }
      }, delay);
    }
    doFade();
  };

  ClassSound.prototype.setLoop = function(loop) {
    if (loop)
      this.sound.loop = 'loop';
    else
      this.sound.removeAttribute('loop');
  };

  exports.create = function(src, opts) {
    return new ClassSound(src, opts);
  };

});
