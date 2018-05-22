var rulerSpritePath = 'img/sprite.png',
    rulerSpriteWidth = 875,
    rulerSpriteHeight = 83,
    rulerSpriteLeftOffset = 36,
    rulerSpriteRightOffset = 60,
    rulerSpriteBottomOffset = 64,
    rulerSteps = 20;

var aInt = [6, 9],
    aPlusBInt = [11, 14];

var rulerContainer = document.getElementById('ruler-container'),
    ruler = document.getElementById('ruler'),
    firstArrow = document.getElementById('first-arrow'),
    secondArrow = document.getElementById('second-arrow'),
    aEl = document.getElementById('a'),
    bEl = document.getElementById('b'),
    inputB = document.getElementById('input-b'),
    inputA = document.getElementById('input-a'),
    inputB = document.getElementById('input-b'),
    answerPlaceholderEl = document.getElementById('answer-placeholder'),
    answerEl = document.getElementById('answer'),
    strokeWidth = 2,
    strokeColor = 'red';

rulerContainer.style.backgroundImage = "url('" + rulerSpritePath +"')";
rulerContainer.style.width = rulerSpriteWidth + 'px';
rulerContainer.style.paddingLeft = rulerSpriteLeftOffset + 'px';
rulerContainer.style.paddingRight = rulerSpriteRightOffset + 'px';
rulerContainer.style.paddingBottom = rulerSpriteBottomOffset + 'px';

var rulerStepWidth = ruler.clientWidth / rulerSteps,
    maxInt = Math.max(aInt[1], aPlusBInt[1] - aInt[0]),
    rulerMinHeight = (maxInt * rulerStepWidth) / 2;

ruler.style.height = Math.max(rulerSpriteHeight, rulerMinHeight)  + 'px';

var a = getRandomInt(aInt[0], aInt[1]),
    b = getRandomInt(aPlusBInt[0] - a, aPlusBInt[1] - a);

aEl.innerHTML = a;
bEl.innerHTML = b;

showArrow(firstArrow, 0, a, rulerStepWidth, strokeWidth, strokeColor, inputA);

inputA.addEventListener('keyup', function(e) {
    var val = e.target.value;

    if (!val) return;

    if (val == a) {
        e.target.setAttribute('disabled', true);

        e.target.className = 'arrow-input arrow-input--success';

        showArrow(secondArrow, a, a + b, rulerStepWidth, strokeWidth, strokeColor, inputB);
    } else {
        e.target.className = 'arrow-input arrow-input--error';
    }
});

inputB.addEventListener('keyup', function(e) {
    var val = e.target.value;

    if (!val) return;

    if (val == b) {
        e.target.setAttribute('disabled', true);

        e.target.className = 'arrow-input arrow-input--success';

        answerPlaceholderEl.style.display = 'none';
        answerEl.style.display = 'inline';
        answerEl.focus();
    } else {
        e.target.className = 'arrow-input arrow-input--error';
    }
});

answerEl.addEventListener('keyup', function(e) {
    var val = e.target.value;

    if (!val) return;

    if (inputA.value != a || inputB.value != b) {
        answerPlaceholderEl.style.display = 'inline';
        answerEl.style.display = 'none';

        return;
    }

    if (val == a + b) {
        e.target.setAttribute('disabled', true);

        answerPlaceholderEl.innerHTML = val;
        answerPlaceholderEl.style.display = 'inline';

        answerEl.style.display = 'none';
    } else {
        e.target.className = 'exercise__input exercise__input--error';
    }
});

function showArrow(el, start, end, stepWidth, strokeWidth, strokeColor, inputA) {
    var paddingsSize = 5;

    var mainLine = el.getElementsByClassName('main-line')[0],
        topLine = el.getElementsByClassName('top-line')[0],
        bottomLine = el.getElementsByClassName('bottom-line')[0];

    var width = stepWidth * (end - start),
        height = width / 2,
        left = (start * stepWidth) - paddingsSize;

    el.style.width = width + (paddingsSize * 2) + 'px';
    el.style.height = width / 2 + 'px';
    el.style.left = left + 'px';

    mainLine.style.strokeWidth = strokeWidth + 'px';

    topLine.style.strokeWidth = strokeWidth + 'px';

    bottomLine.style.strokeWidth = strokeWidth + 'px';

    mainLine.setAttribute(
        'd',
        'M '+ paddingsSize +', '+ height +' C '+ (paddingsSize + (width / 8)) +', '+ paddingsSize +', '+ (width - (width / 8)) +', '+ paddingsSize +', '+ (width + paddingsSize) +', '+ height +''
    );

    topLine.setAttribute(
        'd',
        'M ' + (width + paddingsSize) + ', ' + (height) + ' L ' + ((width + paddingsSize) + 1.333333333333333) + ', ' + (height - 12.66666666666667)
    );

    bottomLine.setAttribute(
        'd',
        'M ' + (width + paddingsSize) + ', ' + (height) + ' L ' + ((width + paddingsSize) - 8) + ', ' + (height - 10)
    );

    var mainLineLength = mainLine.getTotalLength(),
        topLineLength = topLine.getTotalLength(),
        bottomLineLength = bottomLine.getTotalLength();

    mainLine.style.strokeDasharray = mainLineLength + ' ' + mainLineLength;
    mainLine.style.strokeDashoffset = mainLineLength;
    mainLine.style.stroke = strokeColor;

    topLine.style.strokeDasharray = topLineLength + ' ' + topLineLength;
    topLine.style.strokeDashoffset = topLineLength;
    topLine.style.stroke = strokeColor;

    bottomLine.style.strokeDasharray = bottomLineLength + ' ' + bottomLineLength;
    bottomLine.style.strokeDashoffset = bottomLineLength;
    bottomLine.style.stroke = strokeColor;

    animate({
        duration: 1000,
        timing: function(timeFraction) {
            return timeFraction;
        },
        draw: function(progress) {
            mainLine.style.strokeDashoffset = mainLineLength - mainLineLength * progress;

            if (progress == 1) {
                animate({
                    duration: 500,
                    timing: function(timeFraction) {
                        return timeFraction;
                    },
                    draw: function(progress) {
                        topLine.style.strokeDashoffset = topLineLength - topLineLength * progress;
                        bottomLine.style.strokeDashoffset = bottomLineLength - bottomLineLength * progress;

                        if (progress == 1) {
                            showInput(inputA, mainLine, left);
                        }
                    }
                });
            }
        }
    });
}

function showInput(el, arrowLineEl, leftOffset) {
    var arrowLineElBoundingClientRect = arrowLineEl.getBoundingClientRect(),
        arrowLineWidth = arrowLineElBoundingClientRect.width,
        arrowLineHeight = arrowLineElBoundingClientRect.height,
        arrowLineLeftOffset = arrowLineElBoundingClientRect.right;

    el.style.display = 'block';
    el.style.left = leftOffset + (arrowLineWidth / 2) - (el.clientWidth / 2) + 'px';
    el.style.bottom = arrowLineHeight + (el.clientHeight / 2) + 'px';

    el.focus();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animate(options) {
    var start = performance.now();
  
    requestAnimationFrame(function animate(time) {
      var timeFraction = (time - start) / options.duration;

      if (timeFraction > 1) timeFraction = 1;

      var progress = options.timing(timeFraction)
  
      options.draw(progress);
  
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
}