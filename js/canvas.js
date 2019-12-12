!function() {
    var imgWidth = 133
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    var ctx = canvas.getContext('2d');
    var rgb = '110';      // 线条颜色值
    var extendDis = -150;   // 可超出的画布边界
    var lineDis = 300;    // 连线距离
    // 生成图片
    var imgCollector = []
    var moreDis = 60
    var moreDD = 0
    var lineWidth = 2
    var imgNum = 22
    // 手机单独处理
    if (isMobile) {
      canvas.width = window.screen.width
      canvas.height = window.screen.height - 150
      imgWidth = 80
      extendDis = 0
      moreDis = 40
      lineWidth = 1
      canvas.style.top = '0px'
      lineDis = 200
      moreDD = 40
      imgNum = 11
    }

    lineDis *= lineDis;
    window.onresize = function () {
      canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    }

    function genImage (url) {
      var img = new Image()
      img.src = url
      return img
    }
    for (var i = 1; i <= 11; i ++) {
      imgCollector.push(genImage('./icon/m' + i + '.png'))
    }

    var arr = []
    for (var j = 1; j <= 11; j ++) {
      imgCollector.push(genImage('./icon/m' + j + '.png'))
    }
    console.log(arr)
    imgCollector.concat(arr)
    console.log(imgCollector)

    window.onresize = function () {
      canvas.width = window.innerWidth - 200
      canvas.height = window.innerHeight - 200
    }




    var RAF = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
          };
    })();
    // 鼠标活动时，获取鼠标坐标
    var warea = {x: null, y: null};
    // window.onmousemove = function(e) {
    //   e = e || window.event;
    //   warea.x = e.clientX - canvas.offsetLeft;
    //   warea.y = e.clientY - canvas.offsetTop;
    // };
    // window.onmouseout = function(e) {
    //   warea.x = null;
    //   warea.y = null;
    // };
    // 添加粒子
    // x，y为粒子坐标，xa, ya为粒子xy轴加速度，max为连线的最大距离
    var dots = [];
    for (var i = 0; i < imgNum; i++) {
      var x = Math.random() * (canvas.width + 2 * extendDis) - extendDis;
      var y = Math.random() * (canvas.height + 2 * extendDis) - extendDis;
      var xa = (Math.random() * 2 - 1) / 1.5;
      var ya = (Math.random() * 2 - 1) / 1.5;
      dots.push({
        x: x,
        y: y,
        xa: xa,
        ya: ya
      })
    }
    // 延迟100秒开始执行动画，如果立即执行有时位置计算会出错
    setTimeout(function() {
      animate();
    }, 100);
    // 每一帧循环的逻辑
    function animate() {
      // 清空重绘
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // setTimeout(() => {
      //   bubDrawLine([warea].concat(dots));
      // }, 1000);
      bubDrawLine([warea].concat(dots));
      RAF(animate);
    }
    // var imgArry = new Array(11).fill({ img: genImage('../images/m1.png'), width: 200, height: 200, })

    /**
     * 逐个对比连线
     * @param ndots
     */
    function bubDrawLine(ndots) {
      var ndot;
      dots.forEach(function(dot, index) {
        move(dot, index);
        // 循环比对粒子间的距离
        for (var i = 0; i < ndots.length; i++) {
          ndot = ndots[i];
          if (dot === ndot || ndot.x === null || ndot.y === null) continue;
          var xc = dot.x - ndot.x;
          var yc = dot.y - ndot.y;
          // 如果x轴距离或y轴距离大于max,则不计算粒子距离
          if (xc > ndot.max || yc > lineDis) continue;
          // 两个粒子之间的距离
          var dis = xc * xc + yc * yc;
          // 如果粒子距离超过max,则不做处理
          if (dis > lineDis) continue;
          // 距离比
          var ratio;
          // 如果是鼠标，则让粒子向鼠标的位置移动
          if (ndot === warea && dis < 20000) {
            dot.x -= xc * 0.01;
            dot.y -= yc * 0.01;
          }
          // 计算距离比
          ratio = (lineDis - dis) / lineDis;
          // 粒子间连线
          ctx.beginPath();
         
          ctx.lineWidth =  ratio / 2;
          ctx.strokeStyle = 'rgba(' + rgb + ', ' + rgb + ', ' + rgb + ', 1';
          ctx.moveTo(dot.x + moreDis, dot.y + moreDis);
          ctx.lineTo(ndot.x + moreDis, ndot.y + moreDis);
          ctx.stroke();
        }
        // 将已经计算过的粒子从数组中删除
        ndots.splice(ndots.indexOf(dot), 1);
      });
    }
    /**
     * 粒子移动
     * @param dot
     */
    function move(dot, index) {
      dot.x += dot.xa;
      dot.y += dot.ya;
      dot.xa *= (dot.x + moreDD > (canvas.width + extendDis) || dot.x + moreDD < -extendDis) ? -1 : 1;
      dot.ya *= (dot.y + moreDD > (canvas.height + extendDis) || dot.y  + moreDD< -extendDis) ? -1 : 1;
      // 绘制点
      ctx.fillStyle = 'rgba(' + rgb + ', ' + rgb + ', ' + rgb + ', 1';
      // ctx.arc(dot.x, dot.y, 30, 0, 2 * Math.PI);
      // console.log(index)

      ctx.beginPath();
      ctx.fillStyle = "hsl(" + (dot.x + dot.y) + ",60%,60%)";
      ctx.drawImage(imgCollector[index], dot.x, dot.y, imgWidth, imgWidth);
      ctx.closePath();
    }
  }()

