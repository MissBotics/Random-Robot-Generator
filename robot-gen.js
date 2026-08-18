// Edit these to add your own robots in the generator :)
const PARTS = {
  locomotion: [
    "Mars Rover", "BB-8", "WALL-E", "Roomba", "Johnny 5",
    "Robot B-9 (Lost in Space)", "Spot", "M-O",
    "Claptrap", "Quadcopter", "Portal Turret", "TARS"
  ],
  head: [
    "Mars Rover", "BB-8", "WALL-E", "M-O", "AIBO", "Johnny 5",
    "R2-D2", "Gundam", "Bender", "Linguo", "ED-E", "Robby the Robot"
  ],
  arms: [
    "M-O", "BB-8", "Bender", "ED-209", "Gundam", "WALL-E"
  ],
  colour: [
    "BB-8", "Spot", "Claptrap", "R2-D2", "Astro Boy", "EVE", "Bender", "Gundam"
  ],
  extras: [
    "HAL 9000", "Mars Rover: drill", "AIBO", "M-O: red button", "Portal Turret",
    "Claptrap", "Johnny 5", "BB-8", "ED-E", "ED-209"
  ]
};

const rollBtn = document.getElementById("rollBtn");
const scanLine = document.getElementById("scanLine");
const serialEl = document.getElementById("serial");
const loadingBar = document.getElementById("loadingBar");
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
    spinRow("colour", 1000),
    spinRow("extras", 1100)
  ]);

  serialEl.textContent = randomSerial();
  loadingBar.classList.remove("active");
  rollBtn.disabled = false;
}

rollBtn.addEventListener("click", rollRobot);

partButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.row;
    spinRow(category, 500);
  });
});
