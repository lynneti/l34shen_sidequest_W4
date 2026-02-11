const TS = 32;

const levels = [
  {
    name: "Level 1",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { r: 1, c: 1 },
    goal: { r: 9, c: 14 },
    words: [
      { r: 1, c: 2, text: "G" },
      { r: 5, c: 2, text: "B" },
      { r: 7, c: 10, text: "D" },
      { r: 9, c: 13, text: "A" },
    ],
  },
  {
    name: "Level 2",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { r: 1, c: 1 },
    goal: { r: 9, c: 14 },
    words: [
      { r: 1, c: 3, text: "2" },
      { r: 3, c: 4, text: "N" },
      { r: 5, c: 8, text: "D" },
    ],
  },
];

let levelIndex = 0;
let level, grid;

let player = { r: 1, c: 1 };
let words = [];
let gameWon = false;

function setup() {
  level = levels[levelIndex];
  grid = level.grid;
  createCanvas(grid[0].length * TS, grid.length * TS);
  noStroke();
  textFont("sans-serif");
  loadLevel(0);
}

function loadLevel(i) {
  levelIndex = i;
  level = levels[levelIndex];
  grid = level.grid;

  // reset player
  player.r = level.start.r;
  player.c = level.start.c;

  // copy words
  words = level.words.map((w) => ({ ...w, collected: false }));

  // resize canvas if needed (optional but safe)
  resizeCanvas(grid[0].length * TS, grid.length * TS);
}

function draw() {
  background(240);

  if (gameWon) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(22);
    text("YOU WIN 🎉", width / 2, height / 2);
    return;
  }

  drawGrid();
  drawGoal();
  drawWords();
  drawPlayer();
  drawHUD();

  checkCollect();

  if (isLevelFinished()) {
    advanceLevel();
  }
}

function drawGrid() {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 1) fill(30, 50, 60);
      else fill(230);
      rect(c * TS, r * TS, TS, TS);
    }
  }
}

function drawPlayer() {
  fill(200, 60, 70);
  ellipse(player.c * TS + TS / 2, player.r * TS + TS / 2, TS * 0.6);
}

function drawGoal() {
  fill(80, 170, 90);
  rect(level.goal.c * TS, level.goal.r * TS, TS, TS);
}

function drawWords() {
  textAlign(CENTER, CENTER);
  textSize(16);
  fill(0);

  for (let w of words) {
    if (w.collected) continue;
    text(w.text, w.c * TS + TS / 2, w.r * TS + TS / 2);
  }
}

function drawHUD() {
  fill(0);
  textAlign(LEFT, TOP);
  textSize(14);

  const collectedCount = words.filter((w) => w.collected).length;
  text(`${level.name} | Words: ${collectedCount}/${words.length}`, 10, 10);

  if (!allCollected()) {
    text("Collect all words, then go to GREEN tile.", 10, 28);
  } else {
    text("Now go to GREEN tile to finish!", 10, 28);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) tryMove(0, -1);
  if (keyCode === RIGHT_ARROW) tryMove(0, 1);
  if (keyCode === UP_ARROW) tryMove(-1, 0);
  if (keyCode === DOWN_ARROW) tryMove(1, 0);
}

function tryMove(dr, dc) {
  const nr = player.r + dr;
  const nc = player.c + dc;
  if (grid[nr][nc] === 1) return; // wall
  player.r = nr;
  player.c = nc;
}

function checkCollect() {
  for (let w of words) {
    if (!w.collected && w.r === player.r && w.c === player.c) {
      w.collected = true;
    }
  }
}

function allCollected() {
  return words.every((w) => w.collected);
}

function isLevelFinished() {
  const atGoal = player.r === level.goal.r && player.c === level.goal.c;
  return allCollected() && atGoal;
}

function advanceLevel() {
  if (levelIndex < levels.length - 1) {
    loadLevel(levelIndex + 1);
  } else {
    gameWon = true;
  }
}
