const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score; //현재 점수
let scoreText; //현재 점수 텍스트
let highscore; //최고 점수
let highscoreText; //최고 점수 텍스트
let dino; //공룡
let gravity; //중력값
let obstacles = []; //장애물
let gameSpeed; //게임 속도
let keys = {}; //키 값

//이벤트 리스너 추가
document.addEventListener("keydown", function (evt) {
  keys[evt.code] = true;
});
document.addEventListener("keyup", function (evt) {
  keys[evt.code] = false;
});

class Dino {
  constructor(x, y, w, h, c) {
    this.x = x; //x좌표
    this.y = y; //y좌표
    this.w = w; //공룡 너비
    this.h = h; //공룡 높이
    this.c = c; //히트박스 color

    this.dy = 0; //점프할 때 쓸 변수
    this.jumpForce = 15;
    this.originalHeight = h; //숙이기 전 높이
    this.grounded = false; //땅에 있는지 판단
    this.jumpTimer = 0; //점프 시간 체크를 위한 타이머 추가
  }

  Draw() {
    ////히트박스 판정을 위한 네모 그리기
    //ctx.beginPath();
    //ctx.fillStyle = this.c;
    //ctx.fillRect(this.x, this.y, this.w, this.h);
    //ctx.closePath();

    var img = new Image();
    if ((keys["ShiftLeft"] || keys["KeyS"]) && this.grounded) {
      img.src = "dino_down.png";
      ctx.drawImage(img, this.x, this.y, this.w, this.h);
    } else {
      img.src = "dino_up.png";
      ctx.drawImage(img, this.x, this.y, this.w, this.h);
    }
  }

  Jump() {
    //점프함수 추가
    //animate()에서 키 입력 받을 예정
    // -> 키 입력 받아서 점프
    // 점프 시간 계산을 위한 타이머 변수 추가함
    //땅에 있고 타이머 == 0 이면 Jump()를 생성

    if (this.grounded && this.jumpTimer == 0) {
      //땅에 있는지 && 타이머 = 0
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - this.jumpTimer / 50; //갈수록 빠르게 떨어지는 것 구현
    }
  }

  Animate() {
    //키 입력
    if (keys["Space"] || keys["KeyW"]) {
      //스페이스바 or 키보드 W 입력 시
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }

    if ((keys["ShiftLeft"] || keys["KeyS"]) && this.grounded) {
      //왼쉬프트 or 키보드 5 입력시
      this.y += this.h / 2;
      this.h = this.originalHeight / 2; //h를 절반으로 줄여서 숙인 것과 같은 효과
    } else {
      this.h = this.originalHeight;
    }

    this.y += this.dy; //아래에 있던 코드 삭제하고 위로 위치 변경

    //중력 적용
    if (this.y + this.h < canvas.height) {
      // 공중에 떠 있을 때
      this.dy += gravity; //중력만큼 dy++, dy는 중력을 반영해 줌
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.h; //바닥에 딱 붙어 있게 해줌
    }

    // this.y += this.dy; <- 삭제 (뒤에 쓰면 중력 적용할 때 문제가 생김)

    this.Draw(); //Draw함수로 그려줌
  }
}

class Obstacle {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed; //왼쪽으로 달려올 예정
    this.isBird = false;
  }

  Update() {
    //darw해주고 x좌표 갱신해줄 예정
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw() {
    ////히트박스 판정을 위해 네모 그려줌
    //ctx.beginPath();
    //ctx.fillStyle = this.c;
    //ctx.fillRect(this.x, this.y, this.w, this.h);
    //ctx.closePath();

    var img = new Image();
    if (this.isBird == true) {
      img.src = "bird.png";
      ctx.drawImage(img, this.x, this.y, this.w, this.h);
    } else {
      img.src = "catus.png";
      ctx.drawImage(img, this.x, this.y, this.w, this.h);
    }
  }
}

class Text {
  constructor(t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}
function SpawnObstacle() {
  let size = RandomIntInRange(20, 70); //20~70 정수 랜덤 생성, 사이즈를 20~70으로 랜덤으로 적용
  let type = RandomIntInRange(0, 1); //0~1 정수 랜덤 생성, 0 = 선인장, 1 = 새 장애물 생성
  let obstacle = new Obstacle(
    canvas.width + size,
    canvas.height - size,
    size,
    size,
    "#2484E4"
  );

  if (type == 1) {
    obstacle.y -= dino.originalHeight - 10; //새는 공룡 키보다 10만큼 낮게 날게 만들어줌
    obstacle.isBird = true;
  }
  obstacles.push(obstacle); //장애물 객체 생성, 여러개가 계속 생겨야하기 때문
}

function RandomIntInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min); //Math 함수를 통해 random사용
}

function Start() {
  //게임이 시작하면 작동할 함수
  //초기 값 설정
  //공룡을 그려줌
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.font = "20px sans-serif";

  gameSpeed = 3;
  gravity = 1;

  score = 0;
  highscore = 0;

  if (localStorage.getItem("highscore")) {
    highscore = localStorage.getItem("highscore");
  }

  dino = new Dino(25, canvas.height - 150, 50, 50, "pink"); //dino의 x,y,크기,색
  //   dino.Draw(); (업데이트 함수에서 그리기 위해서 삭제)

  scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");

  highscoreText = new Text(
    "Highscore: " + highscore,
    canvas.width - 25,
    25,
    "right",
    "#212121",
    "20"
  );

  requestAnimationFrame(Update); //추가
}

let initialSpawnTimer = 200; //기본 스폰 타이머
let spawnTimer = initialSpawnTimer;

function Update() {
  //지속적으로 변화를 주기 위해 requestAnimatinoFrame 활용
  //clearRect로 지우고 Draw()로 그리기 반복해서
  //앞으로 나가는 것처럼 보이도록 만들기

  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   //   dino.Draw();
  //   dino.x++;
  dino.Animate(); //공룡한테 애니메이션 주는 함수 <- 여기서 그려줄거임

  spawnTimer--; //스폰타이머--
  if (spawnTimer <= 0) {
    //장애물 속도 조절하는 if문
    SpawnObstacle(); // 장애물 객체 생성
    console.log(obstacles);
    spawnTimer = initialSpawnTimer - gameSpeed * 8; //점점 스폰되는 간격이 짧아짐

    if (spawnTimer < 60) {
      spawnTimer = 60; //스폰간격의 하한선 결정
    }
  }

  //장애물 생성
  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

    if (o.x + o.w < 0) {
      obstacles.splice(i, 1);
    }

    if (
      dino.x < o.x + o.w &&
      dino.x + dino.w > o.x &&
      dino.y < o.y + o.h &&
      dino.y + dino.h > o.y
    ) {
      init();
    }

    o.Update();
  }

  score++;
  scoreText.t = "Score: " + score;
  scoreText.Draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.t = "Highscore: " + highscore;
  }

  highscoreText.Draw();

  gameSpeed += 0.003;
}
Start();

function init() {
  obstacles = [];
  score = 0;
  spawnTimer = initialSpawnTimer;
  gameSpeed = 3;

  window.localStorage.setItem("highscore", highscore);
}
