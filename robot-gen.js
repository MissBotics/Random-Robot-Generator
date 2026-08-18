// Edit these to add your own robots in the generator :)
const PARTS = {
  locomotion: [
    "Mars Rover", "BB-8", "WALL-E", "M-O", "Roomba", "Johnny 5",
    "Robot B-9 (Lost in Space)", "Spot", "BigDog",
    "Claptrap", "Astro Boy", "Quadcopter", "EVE", "Portal Turret"
  ],
  head: [
    "R2-D2", "Gundam", "Bender", "WALL-E", "Linguo", "ED-E", "TARS", "Robby the Robot"
  ],
  arms: [
    "GLaDOS", "Stretch", "ED-209", "Mars Rover", "Gundam", "WALL-E"
  ],
  extras: [
    "HAL 9000", "AIBO", "M-O", "Roomba", "Portal Turret",
    "Claptrap", "Johnny 5", "BB-8"
  ]
};

const rollBtn = document.getElementById("rollBtn");
const scanLine = document.getElementById("scanLine");
const serialEl = document.getElementById("serial");
const partButtons = document.querySelectorAll(".part-btn");

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomSerial() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `SERIAL NO. RRG-${n}`;
}

// cycles through quickly then shows the final pick
function spinRow(category, durationMs) {
  return new Promise((resolve) => {
    const btn = document.querySelector(`.part-btn[data-row="${category}"]`);
    const valueEl = document.getElementById(`val-${category}`);
    const list = PARTS[category];
    const finalValue = randomFrom(list);

    btn.classList.add("rolling");
    const intervalMs = 55;
    const ticks = Math.floor(durationMs / intervalMs);
    let count = 0;

    const timer = setInterval(() => {
      valueEl.textContent = randomFrom(list);
      count++;
      if (count >= ticks) {
        clearInterval(timer);
        valueEl.textContent = finalValue;
        btn.classList.remove("rolling");
        resolve(finalValue);
      }
    }, intervalMs);
  });
}

async function rollRobot() {
  rollBtn.disabled = true;
  serialEl.textContent = "SCANNING...";

  scanLine.classList.remove("active");
  void scanLine.offsetWidth; // restart animation
  scanLine.classList.add("active");

  await Promise.all([
    spinRow("locomotion", 650),
    spinRow("head", 800),
    spinRow("arms", 950),
    spinRow("extras", 1100)
  ]);

  serialEl.textContent = randomSerial();
  rollBtn.disabled = false;
}

rollBtn.addEventListener("click", rollRobot);

partButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.row;
    spinRow(category, 500);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  serialEl.textContent = randomSerial();
  rollRobot();
});
