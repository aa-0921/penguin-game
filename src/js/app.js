const testModules = require("./test-module");
require("../css/app.css");
require("../scss/style.scss");

/********** Paste your code here! ************/
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
// c.width = window.innerWidth;
// c.height = window.innerHeight;
// c.width = 900;
c.width = document.documentElement.clientWidth;
c.height = 900;

var size = 15;

document.body.appendChild(c);

var perm = [];

while (perm.length < 255) {
  while (perm.includes((val = Math.floor(Math.random() * 255))));
  perm.push(val);
}

var lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;

var noise = (x) => {
  x = (x * 0.01) % 255;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
};

var player = new (function () {
  this.x = c.width / 2;
  this.y = 0;
  this.ySpeed = 0;
  this.rot = 0;
  this.rSpeed = 0;

  this.img = new Image();
  //画像URLをサーバにuploadしたものにしています
  this.img.src =
    "https://user-images.githubusercontent.com/58985013/86532894-35b63a80-bf08-11ea-947b-0b662c0bfda7.png";
  // this.img.src = "images/trump.png";

  this.draw = function () {
    var p1 = c.height - noise(t + this.x) * 0.45;
    var p2 = c.height - noise(t + 5 + this.x) * 0.45;

    var grounded = 0;

    if (p1 - size > this.y) {
      this.ySpeed += 0.1;
    } else {
      this.ySpeed -= this.y - (p1 - size);
      this.y = p1 - size;

      grounded = 1;
    }

    var toExecutableOnce = function (f) {
      var called = false,
        result = undefined;
      return function () {
        if (!called) {
          result = f.apply(this, arguments);
          called = true;
        }
        return result;
      };
    };
    // var reloading = toExecutableOnce(function () {
    //   // location.reload()
    //   // speed = 0;
    //   console.log("loop", loop);
    //   // window.cancelAnimationFrame(loop);
    //   location.reload();
    //   // setTimeout("location.reload()", 3000);
    // });

    if (!playing || (grounded && Math.abs(this.rot) > Math.PI * 0.5)) {
      playing = false;
      this.rSpeed = 5;
      k.ArrowUp = 1;
      this.x -= speed * 5;
      var timeoutReload = () => {
        if (window.confirm("再挑戦しますか？")) {
          playing = true;
          this.x = c.width / 2;
          this.y = 0;
          this.ySpeed = 0;
          this.rot = 0;
          this.rSpeed = 0;
          k.ArrowUp = 0;
          gameover = false;
        }
      };
      if (gameover === false) {
        setTimeout(timeoutReload, 1500);
        gameover = true;
      }
    }

    var angle = Math.atan2(p2 - size - this.y, this.x + 5 - this.x);

    // this.rot = angle;

    this.y += this.ySpeed;

    if (grounded && playing) {
      this.rot -= (this.rot - angle) * 0.5;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }

    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
    this.rot -= this.rSpeed * 0.1;

    if (this.rot > Math.PI) this.rot = -Math.PI;
    if (this.rot < -Math.PI) this.rot = Math.PI;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.drawImage(this.img, -size, -size, 30, 30);

    ctx.restore();
  };
})();

var t = 0;
var speed = 0;
var playing = true;
var gameover = false;

var k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };

function loop() {
  speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.1;
  t += 10 * speed;
  ctx.fillStyle = "#19f";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = "black";

  ctx.beginPath();
  ctx.moveTo(0, c.height);

  for (var i = 0; i < c.width; i++) {
    ctx.lineTo(i, c.height - noise(t + i) * 0.45);
  }

  ctx.lineTo(c.width, c.height);

  ctx.fill();

  player.draw();
  requestAnimationFrame(loop);
}

onkeydown = (d) => (k[d.key] = 1);
onkeyup = (d) => (k[d.key] = 0);

loop();