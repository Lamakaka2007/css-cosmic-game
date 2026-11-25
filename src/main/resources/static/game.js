const editor = document.querySelector("#code-editor");
const ship = document.querySelector(".ship");
const target = document.querySelector(".target");
const cubes = document.querySelectorAll(".cube");
const formation = document.querySelector(".formation");
const feedback = document.querySelector("#feedback");
const title = document.querySelector(".instructions h1");
const instruction = document.querySelector(".instructions p");
const levelList = document.querySelector("#level-list");
const progressText = document.querySelector("#progress-text");
const hintButton = document.querySelector("#hint-button");
const hintText = document.querySelector("#hint-text");
const skillText = document.querySelector("#skill-text");

const playerStyles = document.createElement("style");
document.head.appendChild(playerStyles);

const levels = [
    {
        title: "Level 1: First Flight",
        instruction: "Move the ship to column 5, row 5.",
        skill: "Place an element in CSS Grid using its row and column.",
        hint: "Change the ship's grid-column and grid-row.",
        code: ".ship {\n    grid-column: 1;\n    grid-row: 1;\n}",
        check: () => Number(getComputedStyle(ship).gridColumnStart) === 5 &&
                     Number(getComputedStyle(ship).gridRowStart) === 5
    },
    {
        title: "Level 2: Satellite Pair",
        instruction: "Place two cubes side by side with flexbox.",
        skill: "Arrange elements in a row with Flexbox.",
        hint: "Flexbox starts with display: flex.",
        count: 2,
        code: ".formation {\n    display: block;\n}",
        check: () => getComputedStyle(formation).display === "flex" &&
                     getComputedStyle(formation).flexDirection === "row"
    },
    {
        title: "Level 3: Three in a Row",
        instruction: "Arrange all three cubes in one row with CSS Grid.",
        skill: "Create columns with CSS Grid.",
        hint: "Use grid-template-columns to create three columns.",
        count: 3,
        code: ".formation {\n    display: grid;\n    grid-template-columns: repeat(1, 48px);\n}",
        check: () => getComputedStyle(formation).display === "grid" &&
                     getComputedStyle(formation).gridTemplateColumns.split(" ").length === 3 && getComputedStyle(formation).gridTemplateRows.split(" ").length === 1
    },
    {
        title: "Level 4: Vertical Formation",
        instruction: "Stack the three cubes in a column using flex-direction.",
        skill: "Arrange Flexbox items in a column.",
        hint: "Look at the flex-direction property.",
        count: 3,
        code: ".formation {\n    display: flex;\n    flex-direction: row;\n}",
        check: () => getComputedStyle(formation).display === "flex" &&
                     getComputedStyle(formation).flexDirection === "column"
    },
    {
        title: "Level 5: Center the Formation",
        instruction: "Center all three cubes horizontally and vertically.",
        skill: "Align items horizontally and vertically.",
        hint: "One flex property moves items horizontally, the other vertically.",
        count: 3,
        code: ".formation {\n    display: flex;\n    justify-content: flex-start;\n    align-items: flex-start;\n}",
        check: () => {
            const style = getComputedStyle(formation);
            return style.display === "flex" &&
                   style.justifyContent === "center" &&
                   style.alignItems === "center";
        }
    },
        {
            title: "Level 6: Color Signals",
            instruction: "Color the cubes blue, yellow, and red with background-color.",
            skill: "Set a different color for each element.",
            hint: "Set background-color separately for each cube.",
            count: 3,
            code: ".cube:nth-child(1) { background-color: black; }\n.cube:nth-child(2) { background-color: black; }\n.cube:nth-child(3) { background-color: black; }",
            check: () =>
                getComputedStyle(cubes[0]).backgroundColor === "rgb(77, 163, 255)" &&
                getComputedStyle(cubes[1]).backgroundColor === "rgb(255, 255, 0)" &&
                getComputedStyle(cubes[2]).backgroundColor === "rgb(255, 0, 0)"
        },
        {
            title: "Level 7: Build a Square",
            instruction: "Arrange four cubes in a 2 × 2 grid.",
            skill: "Build a grid with two columns and two rows.",
            hint: "Create two columns and two rows with CSS Grid.",
            count: 4,
            code: ".formation { display: grid; grid-template-columns: repeat(1, 48px); }",
            check: () => {
                const style = getComputedStyle(formation);
                return style.display === "grid" &&
                    style.gridTemplateColumns.split(" ").length === 2 &&
                    style.gridTemplateRows.split(" ").length === 2;
            }
        },
        {
            title: "Level 8: Triangle Formation",
            instruction: "Use Grid to arrange three cubes like a triangle.",
            skill: "Place items in Grid cells and span columns.",
            hint: "Put two cubes in the first row and center the third below them.",
            count: 3,
            code: ".formation { display: grid; grid-template-columns: repeat(1, 48px); }",
            check: () => {
                const first = getComputedStyle(cubes[0]);
                const second = getComputedStyle(cubes[1]);
                const third = getComputedStyle(cubes[2]);

                return getComputedStyle(formation).display === "grid" &&
                    first.gridColumnStart === "1" && first.gridRowStart === "1" &&
                    second.gridColumnStart === "2" && second.gridRowStart === "1" &&
                    third.gridColumnStart === "1" && ["3", "span 2"].includes(third.gridColumnEnd) &&
                    third.gridRowStart === "2";
            }
        },
        {
            title: "Level 9: Spread the Team",
            instruction: "Place three cubes across the row with space-between.",
            skill: "Distribute items evenly with justify-content.",
            hint: "Find the justify-content value that spreads items apart.",
            count: 3,
            code: ".formation { display: flex; justify-content: flex-start; }",
            check: () => {
                const style = getComputedStyle(formation);
                return style.display === "flex" &&
                    style.flexDirection === "row" &&
                    style.justifyContent === "space-between";
            }
        },
        {
            title: "Level 10: Final Docking",
            instruction: "Build and center a 2 × 2 formation with a 16px gap.",
            skill: "Set gaps and alignment in CSS Grid.",
            hint: "Set two grid gaps, then center the grid inside its container.",
            count: 4,
            code: ".formation { display: grid; grid-template-columns: repeat(1, 48px); }",
            check: () => {
                const style = getComputedStyle(formation);
                return style.display === "grid" &&
                    style.gridTemplateColumns.split(" ").length === 2 &&
                    style.gridTemplateRows.split(" ").length === 2 &&
                    style.columnGap === "16px" &&
                    style.rowGap === "16px" &&
                    style.justifyContent === "center" &&
                    style.alignContent === "center";
            }
        }
];

const PROGRESS_STORAGE_KEY = "css-space-game-progress";

let currentLevel = 0;
let unlockedLevel = 0;
const completedLevels = new Set();

function saveProgress() {
    try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
            currentLevel,
            unlockedLevel,
            completedLevels: [...completedLevels]
        }));
    } catch (error) {
        console.warn("Could not save game progress.", error);
    }
}

function restoreProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));

        if (!saved) return;

        if (Array.isArray(saved.completedLevels)) {
            saved.completedLevels.forEach((index) => {
                if (Number.isInteger(index) && index >= 0 && index < levels.length) {
                    completedLevels.add(index);
                }
            });
        }

        if (Number.isInteger(saved.unlockedLevel)) {
            unlockedLevel = Math.min(
                Math.max(saved.unlockedLevel, 0),
                levels.length - 1
            );
        }

        const highestCompleted = Math.max(-1, ...completedLevels);
        unlockedLevel = Math.min(
            Math.max(unlockedLevel, highestCompleted + 1),
            levels.length - 1
        );

        if (Number.isInteger(saved.currentLevel)) {
            currentLevel = Math.min(
                Math.max(saved.currentLevel, 0),
                unlockedLevel
            );
        }
    } catch (error) {
        console.warn("Could not restore saved game progress.", error);
    }
}

restoreProgress();
function renderProgress() {
    progressText.textContent =
        `Completed: ${completedLevels.size} / ${levels.length}`;

    levelList.innerHTML = "";

    levels.forEach((level, index) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        const isLocked = index > unlockedLevel;

        button.type = "button";
        button.dataset.levelIndex = String(index);
        button.disabled = isLocked;

        const levelName = level.title.replace(/^Level \d+: /, "");
        const marker = completedLevels.has(index)
            ? "✓"
            : isLocked
                ? "🔒"
                : "○";

        button.textContent = `${marker} ${index + 1}. ${levelName}`;

        if (index === currentLevel) {
            button.classList.add("current");
            button.setAttribute("aria-current", "step");
        }

        if (completedLevels.has(index)) {
            button.classList.add("completed");
        }

        item.appendChild(button);
        levelList.appendChild(item);
    });
}

function loadLevel() {
    const level = levels[currentLevel];
    renderProgress();
    saveProgress();
    document.body.dataset.level = String(currentLevel + 1);
    title.textContent = level.title;
    instruction.textContent = level.instruction;
    skillText.textContent = level.skill;
    editor.value = level.code;
    playerStyles.textContent = "";
    hintText.textContent = "";
    hintText.hidden = true;
    hintButton.textContent = "Show hint";
    feedback.textContent = "Change the CSS, then click Check level.";

    cubes.forEach((cube, index) => {
        cube.style.display = index < (level.count || 0) ? "block" : "none";
    });

    if (currentLevel === 0) {
        target.style.gridColumn = target.dataset.column;
        target.style.gridRow = target.dataset.row;
        ship.style.removeProperty("grid-column");
        ship.style.removeProperty("grid-row");
    }
}

function applyPlayerCss() {
    playerStyles.textContent = editor.value;
}
hintButton.addEventListener("click", () => {
    const openingHint = hintText.hidden;

    hintText.textContent = levels[currentLevel].hint;
    hintText.hidden = !openingHint;
    hintButton.textContent = openingHint ? "Hide hint" : "Show hint";
});

levelList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-level-index]");

    if (!button) return;

    const selectedLevel = Number(button.dataset.levelIndex);

    if (selectedLevel > unlockedLevel) return;

    currentLevel = selectedLevel;
    loadLevel();
});
document.querySelector("#apply-button").addEventListener("click", () => {
    applyPlayerCss();
    feedback.textContent = "CSS applied. Now check your level.";
});

document.querySelector("#check-button").addEventListener("click", () => {
    applyPlayerCss();

    if (levels[currentLevel].check()) {
        completedLevels.add(currentLevel);
        unlockedLevel = Math.max(
            unlockedLevel,
            Math.min(currentLevel + 1, levels.length - 1)
        );
        renderProgress();
        saveProgress();

        if (currentLevel < levels.length - 1) {
            currentLevel++;
            loadLevel();
            feedback.textContent = "Level complete! Next level unlocked.";
        } else {
            feedback.textContent = "Mission complete! You finished all 10 levels.";
        }
    } else {
        feedback.textContent = "Not quite. Try changing the CSS.";
    }
});

loadLevel();
