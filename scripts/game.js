define("scripts/game.js", function(exports, require, module) {
  "use strict";

  /**
   * game logic
   */
  var soundManager = require("scripts/sound-manager");
  var fruitManager = require("scripts/fruit-manager");
  var score = require("scripts/object/score");
  var mistake = require("scripts/object/mistake");
  var background = require("scripts/object/background");
  var light = require("scripts/light");
  var layout = require("scripts/layout");
  var random = require("scripts/tools").randomNumber;

  var gameInterval;
  var onGameOver;

  var scoreNumber;
  var mistakeNumber;
  var mistakeLimit;
  var volleyNum;
  var volleyMultipleNumber;
  var gameOver;

  function reset() {
    scoreNumber = 0;
    mistakeNumber = 0;
    mistakeLimit = 3;
    volleyNum = 2;
    volleyMultipleNumber = 5;
    gameOver = false;
  }

  function end() {
    if (gameOver)
      return;
    gameOver = true;

    clearInterval(gameInterval);
    gameInterval = null;

    setTimeout(onGameOver, 1000);
  }

  function explode(fruit) {
    if (gameOver)
      return;
    gameOver = true;

    clearInterval(gameInterval);
    gameInterval = null;

    fruitManager.stopAll();
    background.wobble();
    fruit.break(0, function() {
      fruitManager.removeAll();
      background.stop();
      light.showWhiteLight(onGameOver);
    });
  }

  function applyScore() {
    if (scoreNumber > volleyNum * volleyMultipleNumber) {
      volleyNum++;
      volleyMultipleNumber += 50;
    }
  }

  function addScore(n) {
    scoreNumber += n;
    score.number(scoreNumber);

    applyScore();
  }

  function addMistake(x, y) {
    mistake.showAt(x, y);
    mistake.add();
    mistakeNumber++;
    if (mistakeNumber >= mistakeLimit) {
      end();
    }
  }

  function throwFruit(group, num) {
    var startX = random(layout.width()),
      startY = layout.height() + 120;
    var fruit = fruitManager.throw(group, startX, startY);
    fruit.onSlice = onSlice;
    fruit.onFallOff = onFallOff;

    if (num && num > 1) {
      num--;
      throwFruit(group, num);
    }
  }

  function onFallOff(fruit) {
    if (gameOver)
      return;

    if (fruit.groupName != "frog")
      return;
    addMistake(fruit.x);
  }

  function onSlice(fruit, angle) {
    if (gameOver)
      return;

    soundManager.play(fruit.groupName);
    switch (fruit.groupName) {
      case "bun":
        explode(fruit);
        return;

      case "frog":
        addScore(1);
        break;
    }

    fruit.break(angle);
  }

  function gameLogic() {
    if (fruitManager.count() >= volleyNum)
      return;

    var group;
    var r = random(10000);
    if (r < 2500) {
      group = "bun";
    } else {
      group = "frog"
    }

    throwFruit(group);

    gameLogic();
  }

  exports.start = function(callback) {
    if (gameInterval)
      return;
    reset();
    onGameOver = callback;
    setTimeout(function() {
      gameInterval = setInterval(gameLogic, 1000);
    }, 500);
  };

});
