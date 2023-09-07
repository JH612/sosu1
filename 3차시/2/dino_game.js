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
    //히트박스 판정을 위한 네모 그리기
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
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

    if (keys["ShiftLeft"] || keys["KeyS"]) {
      //왼쉬프트 or 키보드 5 입력시
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

  dino = new Dino(25, canvas.height - 150, 50, 50, "pink"); //dino의 x,y,크기,색
  //   dino.Draw(); (업데이트 함수에서 그리기 위해서 삭제)
  requestAnimationFrame(Update);
}
function Update() {
  //지속적으로 변화를 주기 위해 requestAnimatinoFrame 활용
  //clearRect로 지우고 Draw()로 그리기 반복해서
  //앞으로 나가는 것처럼 보이도록 만들기

  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   //   dino.Draw();
  //   dino.x++;
  dino.Animate(); //공룡한테 애니메이션 주는 함수 <- 여기서 그려줄거임
}
Start();
