// ------------------ Player Object ------------------
let player = {
  name: "",
  gender: "",
  appearance: { hairColor: "", eyeColor: "", hairstyle: "", clothes: "" },
  major: null,
  skills: { diplomacy: 0, logic: 0, charisma: 0, stealth: 0 },
  needs: { hunger: 100, thirst: 100, fatigue: 100 },
  knowledge: 0, social: 0, cheating: 0, money: 0, completedCourses: []
};

// ------------------ DOM Elements ------------------
const startScreen = document.getElementById("startScreen");
const customizationScreen = document.getElementById("customizationScreen");
const mainGame = document.getElementById("mainGame");
const minigameScreen = document.getElementById("minigameScreen");
const curriculumModal = document.getElementById("curriculumModal");

const startBtn = document.getElementById("startBtn");
const loadBtn = document.getElementById("loadBtn");
const nameInput = document.getElementById("playerName");
const genderSelect = document.getElementById("playerGender");

const hairColorSelect = document.getElementById("hairColor");
const eyeColorSelect = document.getElementById("eyeColor");
const hairstyleSelect = document.getElementById("hairstyle");
const clothesSelect = document.getElementById("clothes");
const confirmAppearanceBtn = document.getElementById("confirmAppearance");

const nameBox = document.getElementById("nameBox");
const textBox = document.getElementById("textBox");
const choicesBox = document.getElementById("choices");
const statsBox = document.getElementById("statsBox");

const bookIcon = document.getElementById("bookIcon");

// Character sprite container
const characterSpriteContainer = document.getElementById("characterSprite");

// Minigame elements
const minigameTitle = document.getElementById("minigameTitle");
const minigameTime = document.getElementById("minigameTime");
const ordersContainer = document.getElementById("ordersContainer");
const minigameQuit = document.getElementById("minigameQuit");
const minigameResult = document.getElementById("minigameResult");
const minigameArea = document.getElementById("minigameArea");

const closeCurriculum = document.getElementById("closeCurriculum");
const curriculumList = document.getElementById("curriculumList");

const dormRoomScreen = document.getElementById("dormRoomScreen");
const dormStats = document.getElementById("dormStats");
const restBtn = document.getElementById("restBtn");
const exitDormBtn = document.getElementById("exitDormBtn");
const questList = document.getElementById("questList");

// ------------------ Game Variables ------------------
let scenes = {};
let currentScene = "intro";
let lineIndex = 0;
let cachedScenes = null;

let quizScores = {
  "Marketing": 0, "Psychology": 0, "ComputerScience": 0, "Law": 0,
  "Astronomy": 0, "Geology": 0, "Business/Management": 0, "Nursing": 0
};

// ------------------ Character Sprite Functions ------------------
function updateCharacterSprite() {
  if (!characterSpriteContainer) return;
  
  characterSpriteContainer.innerHTML = "";
  
  if (player.gender === "male") {
    const maleSprite = document.createElement("img");
    maleSprite.src = "images/boy.png";
    maleSprite.alt = "Male Character";
    maleSprite.className = "character-sprite";
    characterSpriteContainer.appendChild(maleSprite);
  } else if (player.gender === "female") {
    const femaleSprite = document.createElement("img");
    femaleSprite.src = "images/girl.png";
    femaleSprite.alt = "Female Character";
    femaleSprite.className = "character-sprite";
    characterSpriteContainer.appendChild(femaleSprite);
  }
}

function handleCharacterDisplay(speaker) {
  if (!characterSpriteContainer) return;
  
  if (speaker === "You") {
    characterSpriteContainer.style.display = "block";
    characterSpriteContainer.classList.add("show");
    updateCharacterSprite();
  } else {
    characterSpriteContainer.style.display = "none";
    characterSpriteContainer.classList.remove("show");
  }
}

// ------------------ Start / UI logic ------------------
startBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Please enter your name!");
  player.name = name;
  player.gender = genderSelect.value;
  startScreen.style.display = "none";
  customizationScreen.style.display = "block";
};

confirmAppearanceBtn.onclick = () => {
  player.appearance.hairColor = hairColorSelect.value;
  player.appearance.eyeColor = eyeColorSelect.value;
  player.appearance.hairstyle = hairstyleSelect.value;
  player.appearance.clothes = clothesSelect.value;

  customizationScreen.style.display = "none";
  mainGame.style.display = "flex";

  updateCharacterSprite();

  currentScene = "monologue_intro";
  lineIndex = 0;
  loadScenes();
};

const rocks = [
  { name: "Granite", image: "granite.jpg" },
  { name: "Basalt", image: "basalt.jpg" },
  { name: "Sandstone", image: "sandstone.jpg" },
  { name: "Marble", image: "marble.jpg" }
];

const curriculum = {
  "Geology": [
    { semester: 1, courses: [
      { name: "Bevezetés a földtudományokba", status: "none" },
      { name: "Ásványtan 1", status: "none" },
      { name: "Általános kémia", status: "none" },
      { name: "Fizika", status: "none" },
      { name: "Matematika geológusoknak", status: "none" },
      { name: "Terepgyakorlat 1", status: "none" }
    ]},
    { semester: 2, courses: [
      { name: "Ásványtan 2", status: "none" },
      { name: "Kőzettan 1", status: "none" },
      { name: "Geológiai térképzés alapjai", status: "none" },
      { name: "Szerkezeti geológia 1", status: "none" },
      { name: "Számítógépes adatelemzés", status: "none" }
    ]},
    { semester: 3, courses: [
      { name: "Kőzettan 2", status: "none" },
      { name: "Üledékföldtan", status: "none" },
      { name: "Térinformatika (GIS)", status: "none" },
      { name: "Szerkezeti geológia 2", status: "none" },
      { name: "Terepgyakorlat 2", status: "none" }
    ]},
    { semester: 4, courses: [
      { name: "Geokémia", status: "none" },
      { name: "Hidrogeológia", status: "none" },
      { name: "Paleontológia", status: "none" },
      { name: "Térképzés és modellezés", status: "none" },
      { name: "Kutatási módszerek", status: "none" }
    ]},
    { semester: 5, courses: [
      { name: "Geofizika", status: "none" },
      { name: "Mérnökgeológia", status: "none" },
      { name: "Környezetföldtan", status: "none" },
      { name: "Adatfeldolgozás és statisztika", status: "none" }
    ]},
    { semester: 6, courses: [
      { name: "Regionális földtan", status: "none" },
      { name: "Talajtan", status: "none" },
      { name: "Üledéses medencék fejlődése", status: "none" },
      { name: "Szakmai gyakorlat", status: "none" }
    ]},
    { semester: 7, courses: [
      { name: "Szakirányos tárgyak (pl. környezetgeológia, olajföldtan)", status: "none" },
      { name: "Terepmunka", status: "none" }
    ]},
    { semester: 8, courses: [
      { name: "Diplomamunka", status: "none" },
      { name: "Kutatási szeminárium", status: "none" },
      { name: "Záróvizsga", status: "none" }
    ]}
  ],

  "Nursing": [
    { semester: 1, courses: [
      { name: "Bevezetés az ápolásba", status: "none" },
      { name: "Anatómia és élettan 1", status: "none" },
      { name: "Egészségtudományi alapismeretek", status: "none" },
      { name: "Kommunikáció az egészségügyben", status: "none" }
    ]},
    { semester: 2, courses: [
      { name: "Anatómia és élettan 2", status: "none" },
      { name: "Ápolástan alapjai", status: "none" },
      { name: "Elsősegélynyújtás", status: "none" },
      { name: "Mikrobiológia és higiéné", status: "none" },
      { name: "Gyakorlati képzés 1", status: "none" }
    ]},
    { semester: 3, courses: [
      { name: "Belgyógyászati ápolás", status: "none" },
      { name: "Sebészeti ápolás", status: "none" },
      { name: "Gyógyszertan", status: "none" },
      { name: "Klinikai gyakorlat 1", status: "none" }
    ]},
    { semester: 4, courses: [
      { name: "Gyermekápolás", status: "none" },
      { name: "Szülészet-nőgyógyászat", status: "none" },
      { name: "Rehabilitáció", status: "none" },
      { name: "Klinikai gyakorlat 2", status: "none" }
    ]},
    { semester: 5, courses: [
      { name: "Pszichiátriai ápolás", status: "none" },
      { name: "Idősgondozás", status: "none" },
      { name: "Egészségnevelés és prevenció", status: "none" },
      { name: "Gyakorlati képzés 3", status: "none" }
    ]},
    { semester: 6, courses: [
      { name: "Összefüggő szakmai gyakorlat", status: "none" },
      { name: "Szakdolgozat", status: "none" },
      { name: "Záróvizsga", status: "none" }
    ]}
  ],

  "Law": [
    { semester: 1, courses: [
      { name: "Bevezetés a jog- és államtudományba", status: "none" },
      { name: "Római jog 1", status: "none" },
      { name: "Alkotmányjog 1", status: "none" },
      { name: "Jogi latin", status: "none" }
    ]},
    { semester: 2, courses: [
      { name: "Római jog 2", status: "none" },
      { name: "Alkotmányjog 2", status: "none" },
      { name: "Jogtörténet", status: "none" },
      { name: "Filozófia / Etika", status: "none" }
    ]},
    { semester: 3, courses: [
      { name: "Polgári jog 1", status: "none" },
      { name: "Büntetőjog 1", status: "none" },
      { name: "Közjogi alapismeretek", status: "none" },
      { name: "Nemzetközi jog 1", status: "none" }
    ]},
    { semester: 4, courses: [
      { name: "Polgári jog 2", status: "none" },
      { name: "Büntetőjog 2", status: "none" },
      { name: "Közigazgatási jog", status: "none" },
      { name: "Európai uniós jog 1", status: "none" }
    ]},
    { semester: 5, courses: [
      { name: "Polgári eljárásjog", status: "none" },
      { name: "Büntetőeljárásjog", status: "none" },
      { name: "Munkajog", status: "none" },
      { name: "Kereskedelmi jog", status: "none" }
    ]},
    { semester: 6, courses: [
      { name: "Pénzügyi jog", status: "none" },
      { name: "Adójog", status: "none" },
      { name: "Környezetvédelmi jog", status: "none" },
      { name: "Nemzetközi magánjog", status: "none" }
    ]},
    { semester: 7, courses: [
      { name: "Szakirányos tárgyak (pl. közjog, magánjog, nemzetközi jog)", status: "none" },
      { name: "Szimulált tárgyalások", status: "none" },
      { name: "Gyakorlati szemináriumok", status: "none" },
      { name: "Szakmai gyakorlat", status: "none" }
    ]},
    { semester: 8, courses: [
      { name: "Diplomamunka", status: "none" },
      { name: "Záróvizsga", status: "none" }
    ]}
  ],

  "ComputerScience": [
    { semester: 1, courses: [
      { name: "Programozás alapjai (Python/C++)", status: "none" },
      { name: "Számítógépes rendszerek", status: "none" },
      { name: "Diszkrét matematika", status: "none" },
      { name: "Logika és algoritmusok", status: "none" }
    ]},
    { semester: 2, courses: [
      { name: "Adatszerkezetek és algoritmusok", status: "none" },
      { name: "Számítógép-architektúra", status: "none" },
      { name: "Operációs rendszerek", status: "none" },
      { name: "Objektorientált programozás", status: "none" }
    ]},
    { semester: 3, courses: [
      { name: "Adatbázisok", status: "none" },
      { name: "Webprogramozás", status: "none" },
      { name: "Hálózatok alapjai", status: "none" },
      { name: "Valószínűségszámítás és statisztika", status: "none" }
    ]},
    { semester: 4, courses: [
      { name: "Szoftverfejlesztés módszertana", status: "none" },
      { name: "Mobilalkalmazás-fejlesztés", status: "none" },
      { name: "Informatikai biztonság", status: "none" },
      { name: "Projektmunka 1", status: "none" }
    ]},
    { semester: 5, courses: [
      { name: "Mesterséges intelligencia", status: "none" },
      { name: "Gépi tanulás / Adatbányászat", status: "none" },
      { name: "Projektmunka 2", status: "none" },
      { name: "Üzleti informatika", status: "none" }
    ]},
    { semester: 6, courses: [
      { name: "Felhőalapú rendszerek", status: "none" },
      { name: "Big Data technológiák", status: "none" },
      { name: "Szabadon választható tárgyak", status: "none" }
    ]},
    { semester: 7, courses: [
      { name: "Szakmai gyakorlat", status: "none" }
    ]},
    { semester: 8, courses: [
      { name: "Diplomamunka", status: "none" },
      { name: "Záróvizsga", status: "none" }
    ]}
  ],

  "Psychology": [
    { semester: 1, courses: [
      { name: "Bevezetés a pszichológiába", status: "none" },
      { name: "Biológiai pszichológia", status: "none" },
      { name: "Kísérleti pszichológia", status: "none" },
      { name: "Kutatásmódszertan 1", status: "none" }
    ]},
    { semester: 2, courses: [
      { name: "Fejlődéslélektan", status: "none" },
      { name: "Szociálpszichológia", status: "none" },
      { name: "Statisztika a pszichológiában", status: "none" },
      { name: "Pszichológiai mérések alapjai", status: "none" }
    ]},
    { semester: 3, courses: [
      { name: "Személyiségpszichológia", status: "none" },
      { name: "Klinikai pszichológia 1", status: "none" },
      { name: "Tanulás- és emlékezetkutatás", status: "none" },
      { name: "Pszichodiagnosztika", status: "none" }
    ]},
    { semester: 4, courses: [
      { name: "Pszichoterápiás irányzatok", status: "none" },
      { name: "Munka- és szervezetpszichológia", status: "none" },
      { name: "Pszichopatológia", status: "none" },
      { name: "Kutatásmódszertan 2", status: "none" }
    ]},
    { semester: 5, courses: [
      { name: "Egészségpszichológia", status: "none" },
      { name: "Iskolapszichológia", status: "none" },
      { name: "Pszichológiai gyakorlat 1", status: "none" }
    ]},
    { semester: 6, courses: [
      { name: "Pszichológiai gyakorlat 2", status: "none" },
      { name: "Szakdolgozat", status: "none" },
      { name: "Záróvizsga", status: "none" }
    ]}
  ]
};

loadBtn.onclick = () => {
  if (!loadGame()) alert("No save found!");
};

bookIcon.onclick = () => {
  curriculumList.innerHTML = "";

  const majorCurriculum = curriculum[player.major];
  if (!majorCurriculum) {
    curriculumList.textContent = "No curriculum found for your major";
    curriculumModal.style.display = "flex";
    return;
  }

  majorCurriculum.forEach(semester => {
    const semTitle = document.createElement("h3");
    semTitle.textContent = `Semester ${semester.semester}`;
    curriculumList.appendChild(semTitle);

    semester.courses.forEach(course => {
      const courseEl = document.createElement("div");
      switch(course.status) {
        case "none": courseEl.style.color = "white"; break;
        case "taken": courseEl.style.color = "lightblue"; break;
        case "completed": courseEl.style.color = "green"; break;
        case "failed": courseEl.style.color = "red"; break;
      }
      courseEl.textContent = course.name;
      curriculumList.appendChild(courseEl);
    });
  });

  curriculumModal.style.display = "flex";
};

closeCurriculum.onclick = () => curriculumModal.style.display = "none";

// ------------------ Load Scenes ------------------
function loadScenes() {
  if (cachedScenes) {
    scenes = cachedScenes;
    updateStatsDisplay();
    showLine();
  } else {
    fetch("scenes.json")
      .then(res => res.json())
      .then(data => {
        scenes = data;
        cachedScenes = data;
        updateStatsDisplay();
        showLine();
      })
      .catch(err => console.error("Error loading scenes:", err));
  }
}

// ------------------ Format Text ------------------
function formatText(text) {
  if (!text) return "";
  return text
    .replace(/{player_name}/g, player.name)
    .replace(/{pronoun}/g, player.gender === "male" ? "him" : "her")
    .replace(/{subject_pronoun}/g, player.gender === "male" ? "he" : "she")
    .replace(/{possessive_pronoun}/g, player.gender === "male" ? "his" : "her")
    .replace(/{player_major}/g, player.major ? player.major : "undeclared student")
    .replace(/{currency}/g, "Unicoin");
}

// ------------------ Update Stats Display ------------------
function updateStatsDisplay() {
  statsBox.innerHTML = `
    💬 Diplomacy: ${player.skills.diplomacy} |
    🧠 Logic: ${player.skills.logic} |
    😎 Charisma: ${player.skills.charisma} |
    🕶️ Stealth: ${player.skills.stealth} <br>
    🍞 Hunger: ${createBar(player.needs.hunger)} |
    💧 Thirst: ${createBar(player.needs.thirst)} |
    😴 Fatigue: ${createBar(player.needs.fatigue)} <br>
    📚 Knowledge: ${player.knowledge} |
    🎉 Social: ${player.social} |
    🕵️ Cheating: ${player.cheating} <br>
    🎓 Major: ${player.major ? player.major : "Undeclared"} |
    💰 Money: ${player.money} Unicoin
  `;
}

const statIcons = {
  diplomacy: "💬",
  logic: "🧠",
  charisma: "😎",
  stealth: "🕶️",
  hunger: "🍞",
  thirst: "💧",
  fatigue: "😴",
  knowledge: "📚",
  social: "🎉",
  cheating: "🕵️",
  money: "💰"
};

function createBar(value) {
  const barLength = 10;
  const filled = Math.max(0, Math.min(10, Math.round((value / 100) * barLength)));
  return `[${"█".repeat(filled)}${" ".repeat(barLength - filled)}] ${Math.max(0, Math.min(100, value))}%`;
}

// ------------------ VN showLine ------------------
function showLine() {
  console.log("[showLine] ENTER – currentScene:", currentScene, "lineIndex:", lineIndex);
  
  if (currentScene === "dorm_room") {
    console.log("[Dorm] Beléptél a kollégiumi szobába");
    
    dormStats.innerHTML = `
      🍞 Éhség: ${player.needs.hunger}%<br>
      💧 Szomjúság: ${player.needs.thirst}%<br>
      😴 Fáradtság: ${player.needs.fatigue}%<br>
      📚 Tudás: ${player.knowledge}<br>
      🎉 Szociális: ${player.social}
    `;

    questList.innerHTML = `
      <p>📖 Tanulás – növeli a Tudást</p>
      <p>🗣️ Barátkozás – növeli a Szociálist</p>
    `;

    mainGame.style.display = "none";
    dormRoomScreen.style.display = "block";
    return;
  }

  const scene = scenes[currentScene];
  if (!scene) {
    console.error("Scene not found:", currentScene);
    return;
  }
 
  const line = scene[lineIndex];
  if (!line) {
    return;
  }

  displayText(line.speaker || "", formatText(line.text));

  if (line.minigame) {
    startMinigame(line.minigame.type, line.minigame);
    return;
  }

  if (line.endNext) {
    currentScene = line.endNext;
    lineIndex = 0;
    showLine();
    return;
  }

  if (line.next) {
    currentScene = line.next;
    lineIndex = 0;
    showLine();
    return;
  }

  if (line.choice) {
    displayChoices(line.choice);
    return;
  }

  if (currentScene === "quiz_result_display") {
    finishMajorQuiz();
    return;
  }

  lineIndex++;
}

function advanceStory(nextScene) {
  console.log("[advanceStory] called with:", nextScene);
  currentScene = nextScene;
  lineIndex = 0;
  showLine();
}

// ------------------ Enhanced CheatMinigameB2 ------------------
class CheatMinigameB2 {
  constructor(successCallback, failCallback) {
    this.successCallback = successCallback;
    this.failCallback = failCallback;
    this.successCount = 0;
    this.requiredSuccess = 3;
    this.failCount = 0;
    this.maxFails = 3;
    this.active = false;
    this.pointerPos = 0;
    this.direction = 1;
    this.speed = 3;
    this.zoneStart = 40;
    this.zoneEnd = 60;
    this.interval = null;
    this.createUI();
  }

  createUI() {
    this.container = document.createElement("div");
    this.container.id = "cheat-game";
    Object.assign(this.container.style, {
      position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
      background: "linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(22, 33, 62, 0.98) 100%)",
      display: "flex", flexDirection: "column", justifyContent: "center", 
      alignItems: "center", zIndex: "9999"
    });

    const title = document.createElement("h2");
    title.innerText = "🕵️ Cheating Challenge";
    Object.assign(title.style, {
      color: "#8be9fd", fontSize: "36px", marginBottom: "20px",
      textShadow: "0 0 20px rgba(139, 233, 253, 0.6)"
    });
    this.container.appendChild(title);

    this.scoreboard = document.createElement("div");
    Object.assign(this.scoreboard.style, {
      color: "#f1fa8c", fontSize: "20px", marginBottom: "30px",
      background: "rgba(0,0,0,0.5)", padding: "15px 30px", borderRadius: "10px",
      border: "2px solid rgba(139, 233, 253, 0.3)"
    });
    this.updateScoreboard();
    this.container.appendChild(this.scoreboard);

    const barContainer = document.createElement("div");
    Object.assign(barContainer.style, {
      width: "600px", padding: "20px", background: "rgba(0,0,0,0.7)",
      borderRadius: "15px", border: "2px solid rgba(139, 233, 253, 0.5)"
    });

    this.bar = document.createElement("div");
    Object.assign(this.bar.style, {
      width: "100%", height: "40px", background: "#2a2a4a", 
      position: "relative", borderRadius: "10px", overflow: "hidden",
      boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
    });
    barContainer.appendChild(this.bar);

    this.zone = document.createElement("div");
    Object.assign(this.zone.style, {
      position: "absolute", left: `${this.zoneStart}%`,
      width: `${this.zoneEnd - this.zoneStart}%`, height: "100%",
      background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
      boxShadow: "0 0 20px rgba(74, 222, 128, 0.5)"
    });
    this.bar.appendChild(this.zone);

    this.pointer = document.createElement("div");
    Object.assign(this.pointer.style, {
      position: "absolute", left: "0%", width: "4px", height: "100%",
      background: "linear-gradient(to bottom, #fbbf24, #f59e0b)",
      boxShadow: "0 0 15px rgba(251, 191, 36, 0.8)",
      transition: "left 0.02s linear"
    });
    this.bar.appendChild(this.pointer);

    this.container.appendChild(barContainer);

    this.instruction = document.createElement("div");
    this.instruction.innerHTML = `
      <div style="margin-top: 30px; text-align: center;">
        <div style="color: white; font-size: 22px; margin-bottom: 10px;">
          Press <span style="background: rgba(139, 233, 253, 0.3); padding: 5px 15px; border-radius: 5px; font-weight: bold;">SPACE</span> when in the green zone!
        </div>
        <div style="color: #94a3b8; font-size: 16px;">
          Get ${this.requiredSuccess} successful hits. ${this.maxFails} mistakes allowed.
        </div>
      </div>
    `;
    this.container.appendChild(this.instruction);

    document.body.appendChild(this.container);
    this.active = true;
    this.start();
    this.bindKeys();
  }

  updateScoreboard() {
    this.scoreboard.innerHTML = `
      ✅ Successes: ${this.successCount}/${this.requiredSuccess} &nbsp;&nbsp;|&nbsp;&nbsp;
      ❌ Failures: ${this.failCount}/${this.maxFails}
    `;
  }

  start() {
    this.interval = setInterval(() => {
      if (!this.active) return;
      this.pointerPos += this.direction * this.speed;
      if (this.pointerPos >= 100) { this.pointerPos = 100; this.direction = -1; }
      if (this.pointerPos <= 0) { this.pointerPos = 0; this.direction = 1; }
      this.pointer.style.left = `${this.pointerPos}%`;
    }, 20);
  }

  bindKeys() {
    this.keyHandler = (e) => {
      if (!this.active) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (this.pointerPos >= this.zoneStart && this.pointerPos <= this.zoneEnd) {
          this.successCount++;
          this.flashZone("success");
          this.updateScoreboard();
          if (this.successCount >= this.requiredSuccess) {
            setTimeout(() => this.end(true), 500);
          }
        } else {
          this.failCount++;
          this.flashZone("fail");
          this.updateScoreboard();
          if (this.failCount >= this.maxFails) {
            setTimeout(() => this.end(false), 500);
          }
        }
      }
    };
    document.addEventListener("keydown", this.keyHandler);
  }

  flashZone(type) {
    const originalBg = this.zone.style.background;
    if (type === "success") {
      this.zone.style.background = "linear-gradient(135deg, #86efac 0%, #4ade80 100%)";
      this.zone.style.boxShadow = "0 0 30px rgba(134, 239, 172, 0.9)";
      this.createParticles("success");
    } else {
      this.zone.style.background = "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)";
      this.zone.style.boxShadow = "0 0 30px rgba(252, 165, 165, 0.9)";
      this.container.style.animation = "shake 0.3s";
    }
    setTimeout(() => {
      this.zone.style.background = originalBg;
      this.zone.style.boxShadow = "0 0 20px rgba(74, 222, 128, 0.5)";
      this.container.style.animation = "";
    }, 300);
  }

  createParticles(type) {
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 8 + 4;
      Object.assign(particle.style, {
        position: "absolute",
        width: size + "px",
        height: size + "px",
        background: type === "success" ? "#4ade80" : "#ef4444",
        borderRadius: "50%",
        left: "50%",
        top: "50%",
        pointerEvents: "none",
        animation: `particle-${i} 0.6s ease-out forwards`
      });
      this.container.appendChild(particle);
      setTimeout(() => particle.remove(), 600);
    }
  }

  end(success) {
    this.active = false;
    clearInterval(this.interval);
    document.removeEventListener("keydown", this.keyHandler);
    
    const result = document.createElement("div");
    Object.assign(result.style, {
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      background: "rgba(0,0,0,0.9)", padding: "40px 60px", borderRadius: "20px",
      border: `3px solid ${success ? "#4ade80" : "#ef4444"}`,
      textAlign: "center", animation: "scaleIn 0.3s ease-out"
    });
    result.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 20px;">${success ? "✅" : "❌"}</div>
      <div style="color: ${success ? "#4ade80" : "#ef4444"}; font-size: 28px; font-weight: bold;">
        ${success ? "Success!" : "Caught!"}
      </div>
    `;
    this.container.appendChild(result);

    setTimeout(() => {
      if (this.container && this.container.parentNode) document.body.removeChild(this.container);
      if (success) this.successCallback();
      else this.failCallback();
    }, 1500);
  }
}

function startCheatMinigame(successNext, failNext) {
  new CheatMinigameB2(
    () => advanceStory(successNext),
    () => advanceStory(failNext)
  );
}

// ------------------ Enhanced FirstAidMinigame ------------------
class FirstAidMinigame {
  constructor(successCallback, failCallback) {
    this.successCallback = successCallback;
    this.failCallback = failCallback;
    this.correctMatches = 0;
    this.totalNeeded = 3;
    this.wrongAttempts = 0;
    this.maxWrong = 3;
    this.matchedPatients = new Set();
    this.createUI();
  }

  createUI() {
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(22, 33, 62, 0.98) 100%)",
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", zIndex: "9999", padding: "40px"
    });

    const title = document.createElement("h2");
    title.innerText = "🏥 First Aid Training";
    Object.assign(title.style, {
      color: "#8be9fd", fontSize: "36px", marginBottom: "10px",
      textShadow: "0 0 20px rgba(139, 233, 253, 0.6)"
    });
    this.container.appendChild(title);

    const subtitle = document.createElement("div");
    subtitle.innerText = "Drag the correct medical supplies to each patient";
    Object.assign(subtitle.style, {
      color: "#94a3b8", fontSize: "18px", marginBottom: "30px"
    });
    this.container.appendChild(subtitle);

    this.scoreDisplay = document.createElement("div");
    Object.assign(this.scoreDisplay.style, {
      color: "#f1fa8c", fontSize: "20px", marginBottom: "20px",
      background: "rgba(0,0,0,0.5)", padding: "10px 25px", borderRadius: "10px",
      border: "2px solid rgba(139, 233, 253, 0.3)"
    });
    this.updateScore();
    this.container.appendChild(this.scoreDisplay);

    this.patients = [
      { id: "cut", text: "Bleeding Wound", emoji: "🩸", correct: "bandage", matched: false },
      { id: "bruise", text: "Swollen Bruise", emoji: "🤕", correct: "icepack", matched: false },
      { id: "burn", text: "Minor Burn", emoji: "🔥", correct: "water", matched: false }
    ];

    const patientArea = document.createElement("div");
    Object.assign(patientArea.style, {
      display: "flex", gap: "25px", marginTop: "30px", marginBottom: "40px"
    });

    this.patientSlots = {};
    this.patients.forEach(p => {
      const slot = document.createElement("div");
      slot.id = p.id;
      Object.assign(slot.style, {
        width: "180px", height: "200px",
        border: "3px dashed rgba(139, 233, 253, 0.5)",
        borderRadius: "15px",
        color: "white", textAlign: "center",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        background: "rgba(0,0,0,0.4)",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)"
      });
      
      const emoji = document.createElement("div");
      emoji.innerText = p.emoji;
      emoji.style.fontSize = "48px";
      emoji.style.marginBottom = "15px";
      slot.appendChild(emoji);
      
      const text = document.createElement("div");
      text.innerText = p.text;
      text.style.fontSize = "18px";
      text.style.fontWeight = "bold";
      slot.appendChild(text);
      
      slot.ondragover = e => {
        e.preventDefault();
        if (!p.matched) {
          slot.style.borderColor = "rgba(139, 233, 253, 0.9)";
          slot.style.background = "rgba(139, 233, 253, 0.15)";
          slot.style.transform = "scale(1.05)";
        }
      };
      
      slot.ondragleave = e => {
        if (!p.matched) {
          slot.style.borderColor = "rgba(139, 233, 253, 0.5)";
          slot.style.background = "rgba(0,0,0,0.4)";
          slot.style.transform = "scale(1)";
        }
      };
      
      slot.ondrop = e => this.handleDrop(e, p, slot);
      
      this.patientSlots[p.id] = slot;
      patientArea.appendChild(slot);
    });
    this.container.appendChild(patientArea);

    const tools = [
      { id: "bandage", text: "Bandage", emoji: "🩹" },
      { id: "icepack", text: "Ice Pack", emoji: "❄️" },
      { id: "water", text: "Clean Water", emoji: "💧" }
    ];

    const toolArea = document.createElement("div");
    Object.assign(toolArea.style, {
      display: "flex", gap: "20px", marginTop: "20px"
    });

    this.toolElements = {};
    tools.forEach(t => {
      const item = document.createElement("div");
      item.id = t.id;
      Object.assign(item.style, {
        width: "140px", height: "140px",
        background: "linear-gradient(135deg, rgba(139, 233, 253, 0.3) 0%, rgba(139, 233, 253, 0.2) 100%)",
        borderRadius: "15px", border: "2px solid rgba(139, 233, 253, 0.5)",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        cursor: "grab", transition: "all 0.3s ease",
        backdropFilter: "blur(10px)"
      });
      
      const emoji = document.createElement("div");
      emoji.innerText = t.emoji;
      emoji.style.fontSize = "48px";
      emoji.style.marginBottom = "10px";
      item.appendChild(emoji);
      
      const text = document.createElement("div");
      text.innerText = t.text;
      text.style.fontSize = "16px";
      text.style.fontWeight = "bold";
      text.style.color = "white";
      item.appendChild(text);
      
      item.draggable = true;
      item.ondragstart = e => {
        e.dataTransfer.setData("tool", t.id);
        item.style.opacity = "0.5";
        item.style.cursor = "grabbing";
      };
      item.ondragend = e => {
        item.style.opacity = "1";
        item.style.cursor = "grab";
      };
      item.onmouseenter = () => {
        if (item.draggable) {
          item.style.transform = "scale(1.1) rotate(-3deg)";
          item.style.boxShadow = "0 8px 25px rgba(139, 233, 253, 0.4)";
        }
      };
      item.onmouseleave = () => {
        item.style.transform = "scale(1) rotate(0deg)";
        item.style.boxShadow = "none";
      };
      
      this.toolElements[t.id] = item;
      toolArea.appendChild(item);
    });
    this.container.appendChild(toolArea);

    document.body.appendChild(this.container);
  }

  updateScore() {
    this.scoreDisplay.innerHTML = `
      ✅ Correct: ${this.correctMatches}/${this.totalNeeded} &nbsp;&nbsp;|&nbsp;&nbsp;
      ❌ Wrong: ${this.wrongAttempts}/${this.maxWrong}
    `;
  }

  handleDrop(e, patient, slot) {
    e.preventDefault();
    const tool = e.dataTransfer.getData("tool");
    
    if (patient.matched) return;
    
    slot.style.borderColor = "rgba(139, 233, 253, 0.5)";
    slot.style.background = "rgba(0,0,0,0.4)";
    slot.style.transform = "scale(1)";
    
    if (tool === patient.correct) {
      patient.matched = true;
      this.correctMatches++;
      slot.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%)";
      slot.style.borderColor = "#4ade80";
      slot.style.borderStyle = "solid";
      slot.style.animation = "successPulse 0.5s ease-out";
      
      const toolEl = this.toolElements[tool];
      if (toolEl) {
        toolEl.style.opacity = "0.3";
        toolEl.draggable = false;
        toolEl.style.cursor = "not-allowed";
      }
      
      this.updateScore();
      
      if (this.correctMatches >= this.totalNeeded) {
        setTimeout(() => this.end(true), 800);
      }
    } else {
      this.wrongAttempts++;
      slot.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)";
      slot.style.animation = "shake 0.5s";
      
      setTimeout(() => {
        if (!patient.matched) {
          slot.style.background = "rgba(0,0,0,0.4)";
          slot.style.animation = "";
        }
      }, 500);
      
      this.updateScore();
      
      if (this.wrongAttempts >= this.maxWrong) {
        setTimeout(() => this.end(false), 800);
      }
    }
  }

  end(success) {
    const result = document.createElement("div");
    Object.assign(result.style, {
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      background: "rgba(0,0,0,0.9)", padding: "40px 60px", borderRadius: "20px",
      border: `3px solid ${success ? "#4ade80" : "#ef4444"}`,
      textAlign: "center", animation: "scaleIn 0.3s ease-out", zIndex: "10000"
    });
    result.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">${success ? "🏥✅" : "❌"}</div>
      <div style="color: ${success ? "#4ade80" : "#ef4444"}; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
        ${success ? "All Patients Treated!" : "Too Many Mistakes!"}
      </div>
      <div style="color: #94a3b8; font-size: 18px;">
        ${success ? "Excellent medical skills!" : "Review your first aid procedures."}
      </div>
    `;
    this.container.appendChild(result);

    setTimeout(() => {
      if (this.container && this.container.parentNode) this.container.remove();
      if (success) this.successCallback();
      else this.failCallback();
    }, 2000);
  }
}

function startFirstAidMinigame(successNext, failNext) {
  new FirstAidMinigame(
    () => { currentScene = successNext; lineIndex = 0; showLine(); },
    () => { currentScene = failNext; lineIndex = 0; showLine(); }
  );
}

// ------------------ Enhanced Library Memory Minigame ------------------
// ------------------ Enhanced Library Memory Minigame ------------------
function startLibraryMinigame(successNext, failNext) {
  mainGame.style.display = "none";
  minigameScreen.style.display = "flex";
  minigameTitle.textContent = "📚 Library Memory Challenge";
  minigameTime.style.display = "none";
  minigameResult.textContent = "";

  const memoryContainer = document.createElement("div");
  memoryContainer.id = "memoryContainer";
  Object.assign(memoryContainer.style, {
    display: "grid",
    gridTemplateColumns: "repeat(4, 120px)",
    gridGap: "15px",
    padding: "20px"
  });

  const cardsData = [
    {text: "Atom", pair: "Basic particle"},
    {text: "Molecule", pair: "Atoms bonded"},
    {text: "Photosynthesis", pair: "Plant energy"},
    {text: "Gravity", pair: "Mass attraction"}
  ];
  
  const cards = [];
  cardsData.forEach(c => {
    cards.push({text:c.text, pair:c.pair, id: c.text});
    cards.push({text:c.pair, pair:c.text, id: c.text});
  });
  cards.sort(() => Math.random()-0.5);

  let firstCard = null;
  let matchedPairs = 0;
  let attempts = 0;
  let canClick = true;

  const scoreDiv = document.createElement("div");
  Object.assign(scoreDiv.style, {
    color: "#f1fa8c", fontSize: "20px", marginBottom: "20px",
    background: "rgba(0,0,0,0.5)", padding: "10px 25px", borderRadius: "10px",
    border: "2px solid rgba(139, 233, 253, 0.3)", textAlign: "center"
  });
  const updateScore = () => {
    scoreDiv.textContent = `Matches: ${matchedPairs}/${cardsData.length} | Attempts: ${attempts}`;
  };
  updateScore();
  minigameScreen.insertBefore(scoreDiv, minigameScreen.children[1]);

  cards.forEach((c, index) => {
    const card = document.createElement("button");
    card.className = "memoryCard";
    card.textContent = "?";
    card.dataset.text = c.text;
    card.dataset.pair = c.pair;
    card.dataset.id = c.id;
    card.dataset.flipped = "false";
    
    Object.assign(card.style, {
      width: "120px", height: "120px",
      background: "linear-gradient(135deg, rgba(139, 233, 253, 0.3) 0%, rgba(139, 233, 253, 0.2) 100%)",
      border: "2px solid rgba(139, 233, 253, 0.5)",
      borderRadius: "12px", cursor: "pointer", fontSize: "16px",
      color: "white", transition: "all 0.3s ease",
      display: "flex", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "10px", fontWeight: "bold",
      backdropFilter: "blur(10px)"
    });
    
    memoryContainer.appendChild(card);

    card.onmouseenter = () => {
      if (card.dataset.flipped === "false") {
        card.style.transform = "scale(1.05)";
        card.style.boxShadow = "0 4px 15px rgba(139, 233, 253, 0.4)";
      }
    };
    card.onmouseleave = () => {
      if (card.dataset.flipped === "false") {
        card.style.transform = "scale(1)";
        card.style.boxShadow = "none";
      }
    };

    card.onclick = () => {
      if (!canClick || card.dataset.flipped === "true") return;
      
      card.dataset.flipped = "true";
      card.textContent = c.text;
      card.style.background = "linear-gradient(135deg, rgba(139, 233, 253, 0.5) 0%, rgba(139, 233, 253, 0.3) 100%)";
      card.style.transform = "rotateY(180deg)";
      
      if (!firstCard) {
        firstCard = card;
      } else {
        canClick = false;
        attempts++;
        updateScore();
        
        if (firstCard.dataset.id === card.dataset.id && firstCard !== card) {
          matchedPairs++;
          player.knowledge += 2;
          updateStatsDisplay();
          updateScore();
          
          firstCard.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.5) 0%, rgba(34, 197, 94, 0.3) 100%)";
          card.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.5) 0%, rgba(34, 197, 94, 0.3) 100%)";
          firstCard.style.borderColor = "#4ade80";
          card.style.borderColor = "#4ade80";
          firstCard.style.cursor = "default";
          card.style.cursor = "default";
          
          firstCard = null;
          canClick = true;
          
          if (matchedPairs === cardsData.length) {
            setTimeout(() => endLibraryMinigame(true), 800);
          }
        } else {
          setTimeout(() => {
            firstCard.textContent = "?";
            card.textContent = "?";
            firstCard.dataset.flipped = "false";
            card.dataset.flipped = "false";
            firstCard.style.background = "linear-gradient(135deg, rgba(139, 233, 253, 0.3) 0%, rgba(139, 233, 253, 0.2) 100%)";
            card.style.background = "linear-gradient(135deg, rgba(139, 233, 253, 0.3) 0%, rgba(139, 233, 253, 0.2) 100%)";
            firstCard.style.transform = "rotateY(0deg)";
            card.style.transform = "rotateY(0deg)";
            firstCard = null;
            canClick = true;
          }, 1000);
        }
      }
    };
  });

  minigameScreen.appendChild(memoryContainer);

  function endLibraryMinigame(success) {
    const result = document.createElement("div");
    Object.assign(result.style, {
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      background: "rgba(0,0,0,0.9)", padding: "40px 60px", borderRadius: "20px",
      border: `3px solid ${success ? "#4ade80" : "#ef4444"}`,
      textAlign: "center", animation: "scaleIn 0.3s ease-out", zIndex: "10000"
    });
    result.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">${success ? "📚✅" : "❌"}</div>
      <div style="color: ${success ? "#4ade80" : "#ef4444"}; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
        ${success ? "All Pairs Matched!" : "Time's Up!"}
      </div>
      <div style="color: #94a3b8; font-size: 18px;">
        ${success ? "Excellent memory skills!" : "Review your study techniques."}
      </div>
    `;
    minigameScreen.appendChild(result);

    setTimeout(() => {
      if (scoreDiv && scoreDiv.parentNode) scoreDiv.remove();
      if (memoryContainer && memoryContainer.parentNode) memoryContainer.remove();
      if (result && result.parentNode) result.remove();
      minigameScreen.style.display = "none";
      mainGame.style.display = "flex";
      
      currentScene = success ? successNext : failNext;
      lineIndex = 0;
      showLine();
    }, 2000);
  }
}
// ------------------ Enhanced Rock Identification Minigame ------------------
function startRockMinigame(successNext, failNext) {
  const rock = rocks[Math.floor(Math.random() * rocks.length)];
  const options = [rock.name];

  while (options.length < 4) {
    const fake = rocks[Math.floor(Math.random() * rocks.length)].name;
    if (!options.includes(fake)) options.push(fake);
  }
  options.sort(() => Math.random() - 0.5);

  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(22, 33, 62, 0.98) 100%)",
    display: "flex", flexDirection: "column", justifyContent: "center",
    alignItems: "center", zIndex: 9999, padding: "40px"
  });

  const title = document.createElement("h2");
  title.innerText = "🪨 Rock Identification Lab";
  Object.assign(title.style, {
    color: "#8be9fd", fontSize: "36px", marginBottom: "10px",
    textShadow: "0 0 20px rgba(139, 233, 253, 0.6)"
  });
  container.appendChild(title);

  const subtitle = document.createElement("div");
  subtitle.innerText = "Identify the rock specimen shown below";
  Object.assign(subtitle.style, {
    color: "#94a3b8", fontSize: "18px", marginBottom: "30px"
  });
  container.appendChild(subtitle);

  const imgFrame = document.createElement("div");
  Object.assign(imgFrame.style, {
    padding: "20px",
    background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
    borderRadius: "20px",
    border: "3px solid rgba(139, 233, 253, 0.5)",
    marginBottom: "40px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
  });

  const img = document.createElement("img");
  img.src = `images/${rock.image}`;
  Object.assign(img.style, {
    width: "300px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "15px",
    display: "block"
  });
  imgFrame.appendChild(img);
  container.appendChild(imgFrame);

  const optionsContainer = document.createElement("div");
  Object.assign(optionsContainer.style, {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
    maxWidth: "500px"
  });

  options.forEach((name, index) => {
    const btn = document.createElement("button");
    btn.innerText = name;
    Object.assign(btn.style, {
      padding: "20px 30px",
      fontSize: "18px",
      fontWeight: "bold",
      background: "linear-gradient(135deg, rgba(139, 233, 253, 0.2) 0%, rgba(139, 233, 253, 0.1) 100%)",
      border: "2px solid rgba(139, 233, 253, 0.5)",
      borderRadius: "12px",
      color: "white",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)"
    });

    btn.onmouseenter = () => {
      btn.style.background = "linear-gradient(135deg, rgba(139, 233, 253, 0.4) 0%, rgba(139, 233, 253, 0.2) 100%)";
      btn.style.transform = "scale(1.05)";
      btn.style.boxShadow = "0 6px 20px rgba(139, 233, 253, 0.4)";
    };

    btn.onmouseleave = () => {
      btn.style.background = "linear-gradient(135deg, rgba(139, 233, 253, 0.2) 0%, rgba(139, 233, 253, 0.1) 100%)";
      btn.style.transform = "scale(1)";
      btn.style.boxShadow = "none";
    };

    btn.onclick = () => {
      optionsContainer.querySelectorAll("button").forEach(b => {
        b.style.pointerEvents = "none";
        b.style.opacity = "0.5";
      });

      const isCorrect = name === rock.name;
      
      if (isCorrect) {
        btn.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.5) 0%, rgba(34, 197, 94, 0.3) 100%)";
        btn.style.borderColor = "#4ade80";
        btn.style.opacity = "1";
        btn.innerHTML = `✅ ${name}`;
      } else {
        btn.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.5) 0%, rgba(220, 38, 38, 0.3) 100%)";
        btn.style.borderColor = "#ef4444";
        btn.style.opacity = "1";
        btn.innerHTML = `❌ ${name}`;
        container.style.animation = "shake 0.5s";
        
        optionsContainer.querySelectorAll("button").forEach(b => {
          if (b.innerText.includes(rock.name) || b.innerText === rock.name) {
            b.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.5) 0%, rgba(34, 197, 94, 0.3) 100%)";
            b.style.borderColor = "#4ade80";
            b.style.opacity = "1";
            b.innerHTML = `✅ ${rock.name}`;
          }
        });
      }

      setTimeout(() => {
        const result = document.createElement("div");
        Object.assign(result.style, {
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          background: "rgba(0,0,0,0.95)", padding: "40px 60px", borderRadius: "20px",
          border: `3px solid ${isCorrect ? "#4ade80" : "#ef4444"}`,
          textAlign: "center", animation: "scaleIn 0.3s ease-out", zIndex: "10000"
        });
        result.innerHTML = `
          <div style="font-size: 64px; margin-bottom: 20px;">${isCorrect ? "🪨✅" : "❌"}</div>
          <div style="color: ${isCorrect ? "#4ade80" : "#ef4444"}; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
            ${isCorrect ? "Correct Identification!" : "Incorrect!"}
          </div>
          <div style="color: #94a3b8; font-size: 18px;">
            The rock is: <span style="color: #8be9fd; font-weight: bold;">${rock.name}</span>
          </div>
        `;
        container.appendChild(result);

        setTimeout(() => {
          if (container.parentNode) container.remove();
          currentScene = isCorrect ? successNext : failNext;
          lineIndex = 0;
          showLine();
        }, 2500);
      }, 1000);
    };

    optionsContainer.appendChild(btn);
  });

  container.appendChild(optionsContainer);
  document.body.appendChild(container);
}

// ------------------ Enhanced Café Minigame ------------------
let cafeMinigameState = null;

function startCafeMinigame(config) {
  mainGame.style.display = "none";
  minigameScreen.style.display = "flex";
  minigameResult.textContent = "";
  ordersContainer.innerHTML = "";
  minigameTitle.textContent = "☕ Campus Café Shift";

  const difficulty = config.difficulty || "easy";
  const settings = {
    duration: difficulty === "easy" ? 30 : 20,
    spawnInterval: difficulty === "easy" ? 2000 : 1500,
    maxActiveOrders: difficulty === "easy" ? 4 : 6,
    rewardPerOrder: difficulty === "easy" ? 10 : 15
  };

  cafeMinigameState = {
    type: "cafe",
    settings,
    timeLeft: settings.duration,
    activeOrders: 0,
    served: 0,
    missed: 0,
    intervalIds: [],
    combo: 0,
    maxCombo: 0
  };

  const statsPanel = document.createElement("div");
  Object.assign(statsPanel.style, {
    background: "rgba(0,0,0,0.7)",
    padding: "20px 30px",
    borderRadius: "15px",
    border: "2px solid rgba(139, 233, 253, 0.5)",
    marginBottom: "20px",
    display: "flex",
    gap: "30px",
    justifyContent: "center",
    backdropFilter: "blur(10px)"
  });

  const createStat = (label, value, color = "#f1fa8c") => {
    const stat = document.createElement("div");
    stat.innerHTML = `
      <div style="color: #94a3b8; font-size: 14px; margin-bottom: 5px;">${label}</div>
      <div style="color: ${color}; font-size: 24px; font-weight: bold;" class="stat-value">${value}</div>
    `;
    return stat;
  };

  const timeDisplay = createStat("Time", cafeMinigameState.timeLeft + "s", "#8be9fd");
  const servedDisplay = createStat("Served", cafeMinigameState.served, "#4ade80");
  const comboDisplay = createStat("Combo", "x" + cafeMinigameState.combo, "#fbbf24");
  const moneyDisplay = createStat("Earned", cafeMinigameState.served * settings.rewardPerOrder + " 💰", "#8be9fd");

  statsPanel.appendChild(timeDisplay);
  statsPanel.appendChild(servedDisplay);
  statsPanel.appendChild(comboDisplay);
  statsPanel.appendChild(moneyDisplay);

  minigameScreen.insertBefore(statsPanel, minigameScreen.children[1]);

  const updateStats = () => {
    timeDisplay.querySelector(".stat-value").textContent = cafeMinigameState.timeLeft + "s";
    servedDisplay.querySelector(".stat-value").textContent = cafeMinigameState.served;
    comboDisplay.querySelector(".stat-value").textContent = "x" + cafeMinigameState.combo;
    moneyDisplay.querySelector(".stat-value").textContent = (cafeMinigameState.served * settings.rewardPerOrder) + " 💰";
  };

  const orderTypes = [
    { name: "☕ Coffee", time: 5000, color: "#8b4513" },
    { name: "🥪 Sandwich", time: 6000, color: "#daa520" },
    { name: "🧃 Juice", time: 4000, color: "#ff6347" },
    { name: "🌯 Wrap", time: 6000, color: "#98fb98" },
    { name: "🥗 Salad", time: 7000, color: "#90ee90" }
  ];

  const spawnLoop = setInterval(() => {
    if (cafeMinigameState.activeOrders < settings.maxActiveOrders) spawnCafeOrder();
  }, settings.spawnInterval);
  cafeMinigameState.intervalIds.push(spawnLoop);

  const countdown = setInterval(() => {
    cafeMinigameState.timeLeft--;
    updateStats();
    if (cafeMinigameState.timeLeft <= 0) endCafeMinigame();
  }, 1000);
  cafeMinigameState.intervalIds.push(countdown);

  minigameQuit.onclick = () => endCafeMinigame(true);

  function spawnCafeOrder() {
    const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const orderCard = document.createElement("div");
    orderCard.id = orderId;
    Object.assign(orderCard.style, {
      width: "160px",
      padding: "20px",
      background: `linear-gradient(135deg, ${orderType.color}40 0%, ${orderType.color}20 100%)`,
      border: `3px solid ${orderType.color}80`,
      borderRadius: "15px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(10px)"
    });

    const orderText = document.createElement("div");
    orderText.textContent = orderType.name;
    Object.assign(orderText.style, {
      fontSize: "24px",
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
      marginBottom: "10px"
    });
    orderCard.appendChild(orderText);

    const progressBar = document.createElement("div");
    Object.assign(progressBar.style, {
      width: "100%",
      height: "8px",
      background: "rgba(0,0,0,0.3)",
      borderRadius: "4px",
      overflow: "hidden"
    });

    const progressFill = document.createElement("div");
    Object.assign(progressFill.style, {
      width: "100%",
      height: "100%",
      background: `linear-gradient(90deg, ${orderType.color} 0%, #ef4444 100%)`,
      transition: `width ${orderType.time}ms linear`,
      borderRadius: "4px"
    });
    progressBar.appendChild(progressFill);
    orderCard.appendChild(progressBar);

    ordersContainer.appendChild(orderCard);
    cafeMinigameState.activeOrders++;

    setTimeout(() => {
      progressFill.style.width = "0%";
    }, 50);

    orderCard.onmouseenter = () => {
      orderCard.style.transform = "scale(1.1) rotate(-2deg)";
      orderCard.style.boxShadow = `0 8px 25px ${orderType.color}60`;
    };

    orderCard.onmouseleave = () => {
      orderCard.style.transform = "scale(1) rotate(0deg)";
      orderCard.style.boxShadow = "none";
    };

    orderCard.onclick = () => {
      cafeMinigameState.served++;
      cafeMinigameState.combo++;
      if (cafeMinigameState.combo > cafeMinigameState.maxCombo) {
        cafeMinigameState.maxCombo = cafeMinigameState.combo;
      }
      cafeMinigameState.activeOrders--;

      orderCard.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.5) 0%, rgba(34, 197, 94, 0.3) 100%)";
      orderCard.style.borderColor = "#4ade80";
      orderCard.style.transform = "scale(1.2)";
      orderCard.style.animation = "successPulse 0.3s ease-out";

      setTimeout(() => {
        if (orderCard.parentNode) orderCard.remove();
      }, 300);

      player.money += settings.rewardPerOrder;
      player.social += 1;
      updateStatsDisplay();
      updateStats();
    };

    setTimeout(() => {
      const el = document.getElementById(orderId);
      if (el && el.parentNode) {
        cafeMinigameState.combo = 0;
        cafeMinigameState.missed++;
        
        el.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.5) 0%, rgba(220, 38, 38, 0.3) 100%)";
        el.style.animation = "shake 0.3s";
        
        setTimeout(() => {
          if (el.parentNode) el.remove();
        }, 300);
        
        cafeMinigameState.activeOrders = Math.max(0, cafeMinigameState.activeOrders - 1);
        updateStats();
      }
    }, orderType.time);
  }

  for (let i = 0; i < Math.min(2, settings.maxActiveOrders); i++) {
    setTimeout(() => spawnCafeOrder(), i * 500);
  }

  function endCafeMinigame(quit = false) {
    cafeMinigameState.intervalIds.forEach(id => clearInterval(id));
    cafeMinigameState.intervalIds = [];
    
    const served = cafeMinigameState.served;
    const missed = cafeMinigameState.missed;
    const reward = served * settings.rewardPerOrder;
    const maxCombo = cafeMinigameState.maxCombo;

    if (!quit) {
      player.knowledge += Math.floor(served / 2);
      player.social += Math.floor(served / 3);
      updateStatsDisplay();
    }

    const results = document.createElement("div");
    Object.assign(results.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "rgba(0,0,0,0.95)",
      padding: "40px 60px",
      borderRadius: "20px",
      border: "3px solid rgba(139, 233, 253, 0.5)",
      textAlign: "center",
      animation: "scaleIn 0.3s ease-out",
      zIndex: "10000",
      minWidth: "400px"
    });

    results.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 20px;">☕✅</div>
      <div style="color: #8be9fd; font-size: 32px; font-weight: bold; margin-bottom: 20px;">
        Shift Complete!
      </div>
      <div style="color: #e0e0e0; font-size: 18px; line-height: 2;">
        <div>📦 Orders Served: <span style="color: #4ade80; font-weight: bold;">${served}</span></div>
        <div>❌ Orders Missed: <span style="color: #ef4444; font-weight: bold;">${missed}</span></div>
        <div>🔥 Max Combo: <span style="color: #fbbf24; font-weight: bold;">x${maxCombo}</span></div>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid rgba(139, 233, 253, 0.3);">
          💰 Total Earned: <span style="color: #8be9fd; font-weight: bold; font-size: 24px;">${reward} Unicoin</span>
        </div>
      </div>
    `;

    minigameScreen.appendChild(results);

    setTimeout(() => {
      if (statsPanel && statsPanel.parentNode) statsPanel.remove();
      if (results && results.parentNode) results.remove();
      ordersContainer.innerHTML = "";
      minigameScreen.style.display = "none";
      mainGame.style.display = "flex";
      
      if (config.nextScene) {
        currentScene = config.nextScene;
        lineIndex = 0;
      }
      showLine();
      saveGame();
    }, 3000);
  }
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  @keyframes scaleIn {
    from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
  
  @keyframes successPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes particle-0 { to { transform: translate(30px, -30px); opacity: 0; } }
  @keyframes particle-1 { to { transform: translate(40px, 0px); opacity: 0; } }
  @keyframes particle-2 { to { transform: translate(30px, 30px); opacity: 0; } }
  @keyframes particle-3 { to { transform: translate(0px, 40px); opacity: 0; } }
  @keyframes particle-4 { to { transform: translate(-30px, 30px); opacity: 0; } }
  @keyframes particle-5 { to { transform: translate(-40px, 0px); opacity: 0; } }
  @keyframes particle-6 { to { transform: translate(-30px, -30px); opacity: 0; } }
  @keyframes particle-7 { to { transform: translate(0px, -40px); opacity: 0; } }
`;
// ------------------ Major key mapping ------------------
const majorKeyMap = {
  "Computer Science": "ComputerScience",
  "Psychology": "Psychology",
  "Law": "Law",
  "Geology": "Geology",
  "Nursing": "Nursing",
  "Business/Management": "Business/Management",
  "Astronomy": "Astronomy"
};

function normalizeMajor(majorName) {
  return majorKeyMap[majorName] || majorName;
}

// ------------------ MiniGame framework ------------------
function startMinigame(type, config = {}) {
  switch(type) {
    case "cafe":
      startCafeMinigame(config);
      break;
    case "cheat":
      startCheatMinigame(config.successNext, config.failNext);
      break;
    case "library":
      startLibraryMinigame(config.successNext, config.failNext);
      break;
    case "firstaid":
      startFirstAidMinigame(config.successNext, config.failNext);
      break;
    case "rock":
      startRockMinigame(config.successNext, config.failNext);
      break;
    default:
      console.warn("Unknown minigame type:", type);
      break;
  }
}

// ------------------ chooseOption ------------------
function chooseOption(choice) {
  if (choice.points) {
    for (const major in choice.points) {
      quizScores[major] = (quizScores[major] || 0) + choice.points[major];
    }
  }

  if (choice.stats) applyStats(choice.stats);
  if (choice.moneyChange) applyMoney(choice.moneyChange);

  if (choice.major) {
    player.major = normalizeMajor(choice.major);
    applyMajorBonuses(player.major);

    const majorSceneMap = {
      "Psychology": "major_psychology",
      "ComputerScience": "major_cs",
      "Law": "major_law",
      "Business/Management": "major_business",
      "Astronomy": "major_astronomy",
      "Geology": "major_geology",
      "Nursing": "major_nursing"
    };
    currentScene = majorSceneMap[player.major] || "major_law";
    lineIndex = 0;
    showLine();
    return;
  }

  if (choice.minigame) {
    const mg = choice.minigame;
    if (mg.type === "cheat" && mg.difficulty === "B2") {
      startCheatMinigame(mg.successNext, mg.failNext);
      return;
    } else {
      startMinigame(mg.type, mg);
      return;
    }
  }

  if (choice.next) {
    lineIndex = 0;
    currentScene = choice.next;
    showLine();
  }
}

function applyStats(stats) {
  for (const key in stats) {
    if (player.skills.hasOwnProperty(key)) player.skills[key] += stats[key];
    else if (player.needs.hasOwnProperty(key)) {
      player.needs[key] = Math.max(0, Math.min(100, player.needs[key] + stats[key]));
    } else if (player.hasOwnProperty(key)) {
      player[key] += stats[key];
    } else {
      if (typeof player[key] === "number") player[key] += stats[key];
      else player[key] = stats[key];
    }
  }
  updateStatsDisplay();
}

function applyMoney(amount) {
  player.money += amount;
  updateStatsDisplay();
}

// ------------------ Major quiz finish ------------------
function finishMajorQuiz() {
  let maxScore = -Infinity;
  for (const major in quizScores) {
    if (quizScores[major] > maxScore) maxScore = quizScores[major];
  }
  const topMajors = Object.keys(quizScores).filter(m => quizScores[m] === maxScore);
  const chosenMajor = topMajors.length > 1 
    ? topMajors[Math.floor(Math.random() * topMajors.length)] 
    : topMajors[0];

  player.major = normalizeMajor(chosenMajor);
  applyMajorBonuses(player.major);

  const majorSceneMap = {
    "Psychology": "major_psychology",
    "ComputerScience": "major_cs",
    "Law": "major_law",
    "Business/Management": "major_business",
    "Astronomy": "major_astronomy",
    "Geology": "major_geology",
    "Nursing": "major_nursing"
  };

  currentScene = majorSceneMap[player.major] || "major_law";
  lineIndex = 0;

  quizScores = { 
    "Psychology": 0, 
    "ComputerScience": 0, 
    "Law": 0, 
    "Astronomy": 0, 
    "Geology": 0, 
    "Nursing": 0, 
    "Business/Management": 0 
  };

  showLine();
}

function applyMajorBonuses(major) {
  switch (major) {
    case "Marketing": player.skills.charisma += 2; player.social += 1; break;
    case "Psychology": player.skills.logic += 2; player.skills.diplomacy += 1; break;
    case "ComputerScience": player.skills.logic += 2; break;
    case "Law": player.skills.logic += 2; player.skills.diplomacy += 1; break;
    case "Astronomy": player.skills.logic += 2; break;
    case "Geology": player.skills.logic += 2; break;
    case "Nursing": player.skills.logic += 1; player.skills.diplomacy += 1; break;
    case "Business/Management": player.skills.logic += 1; player.skills.charisma += 1; player.social += 1; break;
  }
  updateStatsDisplay();
}

// ------------------ Dorm Room ------------------
let dormReturnScene = "next_day_morning";
let availableQuests = [
  { name: "Tanulás a könyvtárban", rewardType: "knowledge", next: "library_scene" },
  { name: "Beszélgetés a szobatárssal", rewardType: "social", next: "roommate_scene" },
  { name: "Titkos akció az éjjel", rewardType: "stealth", next: "night_scene" }
];

function enterDormRoom(returnScene = "next_day_morning") {
  dormReturnScene = returnScene;
  mainGame.style.display = "none";
  dormRoomScreen.style.display = "block";
  renderDormRoom();
}

function renderDormRoom() {
  dormStats.innerHTML = `
    🍞 Hunger: ${createBar(player.needs.hunger)}<br>
    💧 Thirst: ${createBar(player.needs.thirst)}<br>
    😴 Fatigue: ${createBar(player.needs.fatigue)}<br>
    💰 Money: ${player.money} Unicoin
  `;

  questList.innerHTML = "";
  availableQuests.forEach(q => {
    const btn = document.createElement("button");
    btn.textContent = `${q.name} ${statIcons[q.rewardType] || ""}`;
    btn.onclick = () => {
      dormRoomScreen.style.display = "none";
      mainGame.style.display = "flex";
      advanceStory(q.next);
    };
    questList.appendChild(btn);
  });
}

restBtn.onclick = () => {
  player.needs.fatigue = Math.max(0, player.needs.fatigue - 50);
  player.needs.hunger = Math.min(100, player.needs.hunger + 10);
  player.needs.thirst = Math.min(100, player.needs.thirst + 10);
  updateStatsDisplay();
  renderDormRoom();
  alert("Pihentél egyet. A fáradtság csökkent!");
  saveGame();
};

exitDormBtn.onclick = () => {
  dormRoomScreen.style.display = "none";
  mainGame.style.display = "flex";
  advanceStory(dormReturnScene);
};

// ------------------ Save / Load / Reset ------------------
function saveGame() {
  const saveData = { player, currentScene, lineIndex };
  try {
    localStorage.setItem("vn_save", JSON.stringify(saveData));
    console.log("Game saved!");
  } catch (err) {
    console.error("Save failed:", err);
    alert("Save failed – local storage may be full.");
  }
}

function loadGame() {
  const saved = localStorage.getItem("vn_save");
  if (saved) {
    const data = JSON.parse(saved);
    player = data.player;
    currentScene = data.currentScene;
    lineIndex = data.lineIndex;
    startScreen.style.display = "none";
    customizationScreen.style.display = "none";
    mainGame.style.display = "flex";
    
    updateCharacterSprite();
    
    loadScenes();
    console.log("Save loaded!");
    return true;
  }
  return false;
}

function resetGame() {
  localStorage.removeItem("vn_save");
  player = {
    name: "", gender: "",
    appearance: { hairColor: "", eyeColor: "", hairstyle: "", clothes: "" },
    major: null, skills: { diplomacy: 0, logic: 0, charisma: 0, stealth: 0 },
    needs: { hunger: 100, thirst: 100, fatigue: 100 },
    knowledge: 0, social: 0, cheating: 0, money: 0, completedCourses: []
  };
  currentScene = "intro";
  lineIndex = 0;
  startScreen.style.display = "block";
  customizationScreen.style.display = "none";
  mainGame.style.display = "none";
  console.log("Game reset.");
}

// ------------------ UI display functions ------------------
function displayText(speaker, text) {
  nameBox.textContent = speaker;
  textBox.textContent = text;
  choicesBox.innerHTML = "";
  
  handleCharacterDisplay(speaker);
}

function displayChoices(choices) {
  choicesBox.innerHTML = "";
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.classList.add("choice");
    btn.onclick = () => chooseOption(choice);
    choicesBox.appendChild(btn);
  });
}

// ------------------ Click handler ------------------
textBox.onclick = () => {
  const scene = scenes[currentScene];
  if (!scene) return;
  const line = scene[lineIndex];
  if (!line) return;

  if (line.choice) {
    displayChoices(line.choice);
    return;
  }
  
  showLine();
};
