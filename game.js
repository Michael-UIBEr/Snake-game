const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let gameSpeed = 100;
let gameRunning = false;
let gameLoop;

// 玩家蛇
let playerSnake = {
    x: 10,
    y: 10,
    dx: 0,
    dy: 0,
    cells: [],
    maxCells: 4
};

// AI蛇
let aiSnake = {
    x: 15,
    y: 15,
    dx: -1,
    dy: 0,
    cells: [],
    maxCells: 4
};

// AI移动算法 - 简单追踪食物
function moveAI() {
    // 计算到食物的方向
    const dxToFood = food.x - aiSnake.x;
    const dyToFood = food.y - aiSnake.y;

    // 优先选择水平或垂直移动
    if (Math.abs(dxToFood) > Math.abs(dyToFood)) {
        if (dxToFood > 0 && aiSnake.dx !== -1) {
            aiSnake.dx = 1;
            aiSnake.dy = 0;
        } else if (dxToFood < 0 && aiSnake.dx !== 1) {
            aiSnake.dx = -1;
            aiSnake.dy = 0;
        }
    } else {
        if (dyToFood > 0 && aiSnake.dy !== -1) {
            aiSnake.dx = 0;
            aiSnake.dy = 1;
        } else if (dyToFood < 0 && aiSnake.dy !== 1) {
            aiSnake.dx = 0;
            aiSnake.dy = -1;
        }
    }
}

// 食物
let food = {
    x: 5,
    y: 5
};

// 初始化游戏
function initGame() {
    playerSnake = {
        x: 10,
        y: 10,
        dx: 0,
        dy: 0,
        cells: [],
        maxCells: 4
    };
    aiSnake = {
        x: 15,
        y: 15,
        dx: -1,
        dy: 0,
        cells: [],
        maxCells: 4
    };
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    placeFood();
}

// 随机放置食物
function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

// 游戏主循环
function gameUpdate() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 移动玩家蛇
    playerSnake.x += playerSnake.dx;
    playerSnake.y += playerSnake.dy;

    // 穿透墙规则
    if (playerSnake.x < 0) playerSnake.x = tileCount - 1;
    if (playerSnake.x >= tileCount) playerSnake.x = 0;
    if (playerSnake.y < 0) playerSnake.y = tileCount - 1;
    if (playerSnake.y >= tileCount) playerSnake.y = 0;

    // 更新蛇身体
    playerSnake.cells.unshift({x: playerSnake.x, y: playerSnake.y});
    if (playerSnake.cells.length > playerSnake.maxCells) {
        playerSnake.cells.pop();
    }

    // 移动AI蛇
    moveAI();
    aiSnake.x += aiSnake.dx;
    aiSnake.y += aiSnake.dy;

    // AI蛇穿透墙规则
    if (aiSnake.x < 0) aiSnake.x = tileCount - 1;
    if (aiSnake.x >= tileCount) aiSnake.x = 0;
    if (aiSnake.y < 0) aiSnake.y = tileCount - 1;
    if (aiSnake.y >= tileCount) aiSnake.y = 0;

    // 更新AI蛇身体
    aiSnake.cells.unshift({x: aiSnake.x, y: aiSnake.y});
    if (aiSnake.cells.length > aiSnake.maxCells) {
        aiSnake.cells.pop();
    }

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // 绘制玩家蛇
    ctx.fillStyle = 'blue';
    playerSnake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);
    });

    // 绘制AI蛇
    ctx.fillStyle = 'green';
    aiSnake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);
    });

    // 检测吃到食物
    if (playerSnake.x === food.x && playerSnake.y === food.y) {
        playerSnake.maxCells++;
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        placeFood();
    }

    // AI蛇吃到食物
    if (aiSnake.x === food.x && aiSnake.y === food.y) {
        aiSnake.maxCells++;
        placeFood();
    }

    // 检测撞到自己
    for (let i = 1; i < playerSnake.cells.length; i++) {
        if (playerSnake.x === playerSnake.cells[i].x && playerSnake.y === playerSnake.cells[i].y) {
            gameOver("You crashed into yourself!");
            return;
        }
    }

    // 检测AI蛇撞到自己
    for (let i = 1; i < aiSnake.cells.length; i++) {
        if (aiSnake.x === aiSnake.cells[i].x && aiSnake.y === aiSnake.cells[i].y) {
            gameOver("AI Snake crashed into itself! You win!");
            return;
        }
    }

    // 检测玩家撞到AI蛇
    for (let i = 0; i < aiSnake.cells.length; i++) {
        if (playerSnake.x === aiSnake.cells[i].x && playerSnake.y === aiSnake.cells[i].y) {
            gameOver("You crashed into AI Snake!");
            return;
        }
    }
}

function gameOver(message = "Game Over!") {
    clearInterval(gameLoop);
    gameRunning = false;
    alert(`${message} Your score: ${score}`);
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    // 防止180度转弯
    if (e.key === 'ArrowLeft' && playerSnake.dx === 0) {
        playerSnake.dx = -1;
        playerSnake.dy = 0;
    } else if (e.key === 'ArrowRight' && playerSnake.dx === 0) {
        playerSnake.dx = 1;
        playerSnake.dy = 0;
    } else if (e.key === 'ArrowUp' && playerSnake.dy === 0) {
        playerSnake.dx = 0;
        playerSnake.dy = -1;
    } else if (e.key === 'ArrowDown' && playerSnake.dy === 0) {
        playerSnake.dx = 0;
        playerSnake.dy = 1;
    }
});

// 开始游戏
startBtn.addEventListener('click', () => {
    if (!gameRunning) {
        initGame();
        gameRunning = true;
        playerSnake.dx = 1; // 初始向右移动
        playerSnake.dy = 0;
        gameLoop = setInterval(gameUpdate, gameSpeed);
    }
});
