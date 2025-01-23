$(function () {
  const correctPos = []; /*виношу масив за межі функції*/
  let isCorrectPos = false;
  let isTimerRunning = false;
  function correctPosFn() {
    let size = 100;
    if (!isCorrectPos) {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          correctPos.push(
            `${col == 0 ? 0 : "-" + col * size}px ${
              row == 0 ? 0 : "-" + row * size
            }px`
          );
        }
      }
    } else {
      return correctPos;
    }
  } /*Функція для створення правильних background-position */

  let positions = []; /*виношу масив за межі функції*/
  function randomPositionLeft() {
    positions.length = 0;
    let size = 100;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        positions.push(
          `${col == 0 ? 0 : "-" + col * size}px ${
            row == 0 ? 0 : "-" + row * size
          }px`
        );
      }
    }

    positions.sort(() => Math.random() - 0.5);

    $(".puzik").each(function (index) {
      $(this).css("background-position", positions[index]);
    });
  } // Створює і присвоює рандомні background-position для puzik
  randomPositionLeft(); // Це для створення радома під час загрузки сторінки

  function timer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    let timer = $(".mainTimer");
    let setD = new Date(0, 0, 0, 0, 1, 0);
    let minutes = setD.getMinutes();
    let seconds = setD.getSeconds();
    timer.html(`${"0" + minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
    $(".modal-time").html(
      `${"0" + minutes}:${seconds < 10 ? "0" + seconds : seconds}`
    );
    timerInt = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        $(".btn-check").trigger("click");
        resetTimer();
        return;
      }
      if (seconds == 0) {
        minutes -= 1;
        seconds = 60;
      }
      seconds -= 1;
      timer.html(`${"0" + minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
      $(".modal-time").html(
        `${"0" + minutes}:${seconds < 10 ? "0" + seconds : seconds}`
      );
    }, 1000);
    startBTN.prop("disabled", true);
  }
  function resetTimer() {
    clearInterval(timerInt);
    isTimerRunning = false;
  } //скидання таймеру
  let startBTN = $("#startBt");
  startBTN.on("click", function () {
    timer();
    $("#checkRes").prop("disabled", false);
  });
  let newGameBt = $("#newGame");
  newGameBt.on("click", function () {
    $("#checkRes").prop("disabled", true);
    $(".rightBlock .box .puzik").each(function () {
      $(".leftBlock .box:empty").first().append($(this));
    });

    randomPositionLeft();
    resetTimer();
    startBTN.prop("disabled", false);
    let timer = $(".mainTimer");
    let setD = new Date(0, 0, 0, 0, 1, 0);
    let minutes = setD.getMinutes();
    let seconds = setD.getSeconds();
    timer.html(`${"0" + minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
    $(".modal-time").html(
      `${"0" + minutes}:${seconds < 10 ? "0" + seconds : seconds}`
    );
  });

  $(".box").sortable({
    connectWith: ".box",
    containment: ".puzzleBoxes",
    start: function () {
      startBTN.trigger("click");
    },
  });
  const rbPos = [];
  function addRbPos() {
    rbPos.length = 0;
    $(".rightBlock .box .puzik").each(function () {
      let bgPos = $(this).css("background-position");
      console.log(bgPos);

      rbPos.push(bgPos);
    });
  }
  $("#checkRes").prop("disabled", true);
  $("#checkRes").click(function () {
    $(".modal").fadeIn(300); // Плавне затемнення
    $(".modal-sure").slideDown(300); // Виїжджання зверху
  });
  $(".btn-closeSure").click(function () {
    $(".modal").fadeOut(300);
    $(".modal-sure").slideUp(300);
  });
  $(".btn-check").click(function () {
    $(".modal").fadeOut(300);
    $(".modal-sure").slideUp(300);
    correctPosFn();
    isCorrectPos = true;
    addRbPos();
    console.log("rightbl", rbPos);
    console.log("correctpos", correctPos);
    if (rbPos.length == correctPos.length) {
      const isCorrect = rbPos.every((pos, index) => pos === correctPos[index]);
      if (isCorrect) {
        $(".modal").fadeIn(300);
        $(".modal-win").slideDown(300);
      } else {
        $(".modal").fadeIn(300);
        $(".modal-lose").slideDown(300);
      }
    } else {
      $(".modal").fadeIn(300);
      $(".modal-lose").slideDown(300);
    }
    $("#checkRes").prop("disabled", true);
  });
  $(".btn-closeLose").click(function () {
    $(".modal").fadeOut(300);
    $(".modal-lose").slideUp(300);
    resetTimer();
  });
  $(".btn-closeWin").click(function () {
    $(".modal").fadeOut(300);
    $(".modal-win").slideUp(300);
    resetTimer();
  });
});
