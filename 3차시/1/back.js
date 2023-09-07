var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//예제 1

// ctx.fillRect(0, 0, 100, 100);

// ctx.clearRect(20, 20, 60, 60);

// ctx.strokeRect(22, 22, 56, 56);

//예제 2

// ctx.fillStyle = "#FF4567";
// ctx.strokeStyle = "#FFF000";

// ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(50, 0);
// ctx.lineTo(0, 50);
// ctx.fill();

// ctx.beginPath();
// ctx.moveTo(53, 53);
// ctx.lineTo(2, 53);
// ctx.lineTo(53, 2);
// ctx.lineTo(53, 53);
// ctx.stroke();

//예제 3

// ctx.globalAlpha = 0.2;

// ctx.fillStyle = "#FFF000";
// ctx.fillRect(0, 0, 75, 75);
// ctx.fillStyle = "#0f0";
// ctx.fillRect(75, 0, 75, 75);
// ctx.fillStyle = "#5187ff";
// ctx.fillRect(0, 75, 75, 75);
// ctx.fillStyle = "#FF1234";
// ctx.fillRect(75, 75, 75, 75);

// 예제 4

// ctx.font = "30px serif";
// ctx.fillText("선린의 터를", 10, 50);
// ctx.strokeText("선린인터넷고등학교", 10, 100);

// 예제 5

ctx.font = "48px serif";
var count = 0;
function run() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
  if (count > 1000) {
    return;
  }
  count += 1;
  ctx.strokeText(count, 10, 50);
  requestAnimationFrame(run);
}
requestAnimationFrame(run);
