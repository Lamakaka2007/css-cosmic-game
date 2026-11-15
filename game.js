const levels = [
  {
    title: 'Level 1: First steps',
    instruction: 'The cat is guarding the middle row. Move the mouse to row 1, column 2 to take a safe first step.',
    starter: '/* Move the mouse to row 1, column 2 */\n.mouse {\n  grid-column: 1;\n  grid-row: 2;\n}',
    target: { column: 2, row: 1 },
    lesson: 'Grid items can be placed with grid-column and grid-row. Each property points to a numbered track in the room.'
  },
  {
    title: 'Level 2: Find a safe path',
    instruction: 'The cat blocks row 2. Guide the mouse around it to row 3, column 5, below the cheese.',
    starter: '/* Go around the cat: row 3, column 5 */\n.mouse {\n  grid-column: 1;\n  grid-row: 2;\n}',
    target: { column: 5, row: 3 },
    lesson: 'You can combine grid-column and grid-row to choose a tile. Try changing both values, then apply your CSS.'
  },
  {
    title: 'Level 3: A shorter rule',
    instruction: 'Use the grid-area shorthand to place the mouse on row 2, column 5, next to the cheese.',
    starter: '/* grid-area is: row-start / column-start */\n.mouse {\n  grid-area: 2 / 1;\n}',
    target: { column: 5, row: 2 },
    lesson: 'The grid-area shorthand can set a grid item’s row and column in one declaration: row-start / column-start.'
  }
];

const editor = document.querySelector('#code-editor');
const room = document.querySelector('#room');
const status = document.querySelector('#status');
const styleTag = document.createElement('style');
styleTag.id = 'player-styles';
document.head.append(styleTag);

let currentLevel = 0;

function setStatus(message, type = '') {
  status.textContent = message;
  status.className = `status${type ? ` ${type}` : ''}`;
}

function renderLevel() {
  const level = levels[currentLevel];
  document.querySelector('#level-title').textContent = level.title;
  document.querySelector('#level-count').textContent = `${currentLevel + 1} / ${levels.length}`;
  document.querySelector('#level-instruction').textContent = level.instruction;
  document.querySelector('#lesson-text').textContent = level.lesson;
  editor.value = level.starter;
  document.querySelector('#previous-button').disabled = currentLevel === 0;
  document.querySelector('#next-button').disabled = currentLevel === levels.length - 1;
  applyCss(false);
  setStatus('Add CSS, then check your solution.');
}

function applyCss(showMessage = true) {
  styleTag.textContent = editor.value;
  if (showMessage) setStatus('CSS applied. Try your solution when you’re ready.');
}

function getGridLine(value) {
  const match = value.match(/-?\d+/);
  return match ? Number(match[0]) : NaN;
}

function checkSolution() {
  applyCss(false);
  const mouseStyle = getComputedStyle(document.querySelector('#mouse'));
  const level = levels[currentLevel];
  const column = getGridLine(mouseStyle.gridColumnStart);
  const row = getGridLine(mouseStyle.gridRowStart);

  if (column === level.target.column && row === level.target.row) {
    setStatus('Nice work! The mouse reached the right tile. Choose another level or keep exploring.', 'success');
  } else {
    setStatus('Not quite yet. Check the target row and column in the instructions, then try again.', 'error');
  }
}

document.querySelector('#apply-button').addEventListener('click', () => applyCss());
document.querySelector('#check-button').addEventListener('click', checkSolution);
document.querySelector('#reset-button').addEventListener('click', () => {
  editor.value = levels[currentLevel].starter;
  applyCss(false);
  setStatus('Starter code restored. Give it another try.');
});
document.querySelector('#previous-button').addEventListener('click', () => {
  if (currentLevel > 0) { currentLevel -= 1; renderLevel(); }
});
document.querySelector('#next-button').addEventListener('click', () => {
  if (currentLevel < levels.length - 1) { currentLevel += 1; renderLevel(); }
});

editor.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.setRangeText('  ', start, end, 'end');
  }
});

renderLevel();
