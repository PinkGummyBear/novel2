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
const startCafeBtn = document.getElementById("startCafeBtn");

// Minigame elements
const minigameTitle = document.getElementById("minigameTitle");
const minigameTime = document.getElementById("minigameTime");
const ordersContainer = document.getElementById("ordersContainer");
const minigameQuit = document.getElementById("minigameQuit");
const minigameResult = document.getElementById("minigameResult");

const closeCurriculum = document.getElementById("closeCurriculum");
const curriculumList = document.getElementById("curriculumList");




// ------------------ Game Variables ------------------
let scenes = {};
let currentScene = "intro";
let lineIndex = 0;
let cachedScenes = null;

let quizScores = {
  "Marketing": 0, "Psychology": 0, "ComputerScience": 0, "Law": 0,
  "Astronomy": 0, "Geology": 0, "Business/Management": 0
};




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
  mainGame.style.display = "block";

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
      { name: "Üledéskes medencék fejlődése", status: "none" },
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
      { name: "Objektumorientált programozás", status: "none" }
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
      // státusz alapján színezés
      switch(course.status) {
        case "none": courseEl.style.color = "black"; break;
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
console.log("Current major:", player.major);


closeCurriculum.onclick = () => curriculumModal.style.display = "none";




// ------------------ Load Scenes ------------------
function loadScenes() {
  if (cachedScenes) {
    scenes = cachedScenes;
    updateStatsDisplay();
    showLine();
  } else {
    fetch("scenes2.json")
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
  console.log("[showLine] ENTER — currentScene:", currentScene, "lineIndex:", lineIndex);
  // ---- Kollégiumi szoba jelenet ----
if (currentScene === "dorm_room") {
  console.log("[Dorm] Beléptél a kollégiumi szobába");
  
  // statok megjelenítése
  dormStats.innerHTML = `
    🍞 Éhség: ${player.needs.hunger}%<br>
    💧 Szomjúság: ${player.needs.thirst}%<br>
    😴 Fáradtság: ${player.needs.fatigue}%<br>
    📚 Tudás: ${player.knowledge}<br>
    🎉 Szociális: ${player.social}
  `;

  // teszt jellegű questlista
  questList.innerHTML = `
    <p>📖 Tanulás – növeli a Tudást</p>
    <p>🗣️ Barátkozás – növeli a Szociálist</p>
  `;

  // fő UI elrejtése, dorm megjelenítése
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
    // End of scene without next line
    return;
  }

  // Display the current line
  displayText(line.speaker || "", formatText(line.text));

  // ---- Minigame handling ----
  if (line.minigame) {
    startMinigame(line.minigame.type, line.minigame);
    return;
  }

  // ---- Automatic transitions ----
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

  // ---- Choices ----
  if (line.choice) {
    displayChoices(line.choice);
    return;
  }

  // ---- Special scenes ----
  if (currentScene === "quiz_result_display") {
    finishMajorQuiz();
    return;
  }



  // ---- Prepare for next line on next click ----
  lineIndex++;
}


// Advance story helper
function advanceStory(nextScene) {
  console.log("[advanceStory] called with:", nextScene);
  currentScene = nextScene;
  lineIndex = 0;
  showLine();
}



// ------------------ CheatMinigameB2 (kept as requested) ------------------
class CheatMinigameB2 {
  constructor(successCallback, failCallback) {
    this.successCallback = successCallback;
    this.failCallback = failCallback;
    this.successCount = 0;
    this.requiredSuccess = 3; // 3 sikeres nyomás kell
    this.failCount = 0;
    this.maxFails = 3; // 3 hibás nyomás után vesztes
    this.active = false;
    this.pointerPos = 0;
    this.direction = 1;
    this.speed = 5; // pointer sebesség
    this.zoneStart = 40; // zöld zóna kezdete %
    this.zoneEnd = 60;   // zöld zóna vége %
    this.interval = null;
    this.createUI();
  }

  createUI() {
    this.container = document.createElement("div");
    this.container.id = "cheat-game";
    Object.assign(this.container.style, {
      position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
      background: "rgba(0,0,0,0.7)", display: "flex",
      flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: "9999"
    });

    // Game bar
    this.bar = document.createElement("div");
    Object.assign(this.bar.style, {
      width: "400px", height: "30px", background: "#444", position: "relative", borderRadius: "5px"
    });
    this.container.appendChild(this.bar);

    // Green zone
    this.zone = document.createElement("div");
    Object.assign(this.zone.style, {
      position: "absolute",
      left: `${this.zoneStart}%`,
      width: `${this.zoneEnd - this.zoneStart}%`,
      height: "100%",
      background: "green"
    });
    this.bar.appendChild(this.zone);

    // Pointer
    this.pointer = document.createElement("div");
    Object.assign(this.pointer.style, {
      position: "absolute", left: "0%", width: "10px", height: "100%", background: "yellow"
    });
    this.bar.appendChild(this.pointer);

    // Instructions
    this.instruction = document.createElement("div");
    this.instruction.innerText = `Press SPACE when the pointer is in the green zone!`;
    Object.assign(this.instruction.style, { color: "#fff", marginTop: "20px" });
    this.container.appendChild(this.instruction);

    document.body.appendChild(this.container);
    this.active = true;
    this.start();
    this.bindKeys();
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
        if (this.pointerPos >= this.zoneStart && this.pointerPos <= this.zoneEnd) {
          this.successCount++;
          this.flashZone("success");
          if (this.successCount >= this.requiredSuccess) this.end(true);
        } else {
          this.failCount++;
          this.flashZone("fail");
          if (this.failCount >= this.maxFails) this.end(false);
        }
      }
    };
    document.addEventListener("keydown", this.keyHandler);
  }

  flashZone(type) {
    this.zone.style.background = type === "success" ? "lime" : "red";
    setTimeout(() => { this.zone.style.background = "green"; }, 300);
  }

  end(success) {
    this.active = false;
    clearInterval(this.interval);
    document.removeEventListener("keydown", this.keyHandler);
    if (this.container && this.container.parentNode) document.body.removeChild(this.container);
    if (success) this.successCallback();
    else this.failCallback();
  }
}

// Wrapper to start cheat minigame (single definition)
function startCheatMinigame(successNext, failNext) {
  new CheatMinigameB2(
    () => advanceStory(successNext),
    () => advanceStory(failNext)
  );
}


class FirstAidMinigame {
  constructor(successCallback, failCallback) {
    this.successCallback = successCallback;
    this.failCallback = failCallback;
    this.correctMatches = 0;
    this.totalNeeded = 3;
    this.failCount = 0;
    this.maxFails = 2;
    this.createUI();
  }

  createUI() {
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.7)", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", zIndex: "9999"
    });

    const title = document.createElement("h2");
    title.innerText = "Drag each item to the correct patient!";
    title.style.color = "white";
    this.container.appendChild(title);

    // Beteg szekció
    this.patients = [
      { id: "cut", text: "Bleeding wound 🩸", correct: "bandage" },
      { id: "bruise", text: "Bruise 🤕", correct: "icepack" },
      { id: "burn", text: "Burn 🔥", correct: "water" }
    ];

    const patientArea = document.createElement("div");
    Object.assign(patientArea.style, { display: "flex", gap: "20px", marginTop: "30px" });

    this.patients.forEach(p => {
      const slot = document.createElement("div");
      slot.id = p.id;
      slot.innerText = p.text;
      Object.assign(slot.style, {
        width: "120px", height: "120px", border: "2px dashed white",
        color: "white", textAlign: "center", lineHeight: "120px"
      });
      slot.ondragover = e => e.preventDefault();
      slot.ondrop = e => this.handleDrop(e, p);
      patientArea.appendChild(slot);
    });
    this.container.appendChild(patientArea);

    // Eszközök
    const tools = [
      { id: "bandage", text: "Bandage 🩹" },
      { id: "icepack", text: "Ice Pack ❄️" },
      { id: "water", text: "Water 💧" }
    ];

    const toolArea = document.createElement("div");
    Object.assign(toolArea.style, { display: "flex", gap: "20px", marginTop: "40px" });

    tools.forEach(t => {
      const item = document.createElement("div");
      item.id = t.id;
      item.innerText = t.text;
      Object.assign(item.style, {
        width: "100px", height: "100px", background: "#fff", borderRadius: "10px",
        textAlign: "center", lineHeight: "100px", cursor: "grab"
      });
      item.draggable = true;
      item.ondragstart = e => e.dataTransfer.setData("tool", t.id);
      toolArea.appendChild(item);
    });
    this.container.appendChild(toolArea);

    document.body.appendChild(this.container);
  }

  handleDrop(e, patient) {
    const tool = e.dataTransfer.getData("tool");
    if (tool === patient.correct) {
      this.correctMatches++;
      document.getElementById(patient.id).style.background = "green";
      if (this.correctMatches >= this.totalNeeded) this.end(true);
    } else {
      this.failCount++;
      document.getElementById(patient.id).style.background = "red";
      if (this.failCount >= this.maxFails) this.end(false);
    }
  }

  end(success) {
    if (this.container && this.container.parentNode) this.container.remove();
    if (success) this.successCallback();
    else this.failCallback();
  }
}

// ------------------ Library Memory (memory-card) Minigame ------------------
function startLibraryMinigame(successNext, failNext) {
  mainGame.style.display = "none";
  minigameScreen.style.display = "block";
  minigameTitle.textContent = "Library Memory Challenge";
  minigameResult.textContent = "";

  const memoryContainer = document.createElement("div");
  memoryContainer.id = "memoryContainer";
  memoryContainer.style.display = "grid";
  memoryContainer.style.gridTemplateColumns = "repeat(4, 100px)";
  memoryContainer.style.gridGap = "10px";
  minigameScreen.appendChild(memoryContainer);

  // Terms + definitions pairs
  const cardsData = [
    {text: "Atom", pair: "Alapvető részecske"},
    {text: "Molekula", pair: "Két vagy több atom összekapcsolódása"},
    {text: "Fotoszintézis", pair: "Növények energiatermelése fényből"},
    {text: "Gravitáció", pair: "Tömegek vonzása egymáshoz"}
  ];
  // Duplicate and shuffle
  const cards = [];
  cardsData.forEach(c => { cards.push({text:c.text, pair:c.pair}); cards.push({text:c.pair, pair:c.text}); });
  cards.sort(() => Math.random()-0.5);

  let firstCard = null;
  let matchedPairs = 0;

  cards.forEach((c, index) => {
    const card = document.createElement("button");
    card.className = "memoryCard";
    card.textContent = "?";
    card.dataset.text = c.text;
    card.dataset.pair = c.pair;
    memoryContainer.appendChild(card);

    card.onclick = () => {
      if (card.textContent !== "?") return; // already flipped
      card.textContent = c.text;
      if (!firstCard) {
        firstCard = card;
      } else {
        if (firstCard.dataset.pair === card.dataset.text) {
          // success
          matchedPairs++;
          player.knowledge += 2;
          updateStatsDisplay();
          firstCard = null;
          if (matchedPairs === cardsData.length) {
            endLibraryMinigame(true);
          }
        } else {
          // fail - flip back after delay
          setTimeout(() => {
            firstCard.textContent = "?";
            card.textContent = "?";
            firstCard = null;
          }, 1000);
        }
      }
    };
  });

  minigameQuit.onclick = () => endLibraryMinigame(false);

  function endLibraryMinigame(success) {
    // cleanup
    if (memoryContainer && memoryContainer.parentNode) minigameScreen.removeChild(memoryContainer);
    minigameScreen.style.display = "none";
    mainGame.style.display = "block";
    minigameResult.textContent = success ? "You completed the library challenge!" : "You quit the library minigame.";
    if (success) advanceStory(successNext);
    else advanceStory(failNext);
  }
}

// ------------------ chooseOption / applyStats / money ------------------
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

// ------------------ chooseOption ------------------
function chooseOption(choice) {
  // Quiz pontok
  if (choice.points) {
    for (const major in choice.points) {
      quizScores[major] = (quizScores[major] || 0) + choice.points[major];
    }
  }

  // Stats (skills, needs, money)
  if (choice.stats) applyStats(choice.stats);
  if (choice.moneyChange) applyMoney(choice.moneyChange);

  // Ha van major mező, beállítjuk a player.major-t
  if (choice.major) {
    player.major = normalizeMajor(choice.major);
    applyMajorBonuses(player.major);

    // automatikusan átugrunk a szakhoz tartozó scene-re
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
    return; // ne fusson tovább
  }

  // Minijátékok
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

  // Ha van next
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
      // fallback: allow direct fields like "knowledge", "social"
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

  // reset quiz pontok
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

  console.log("Chosen major:", chosenMajor);
  console.log("Normalized major:", player.major);
  console.log("Curriculum keys:", Object.keys(curriculum));
}

function chooseMajorManually(majorName) {
  player.major = majorName;
  applyMajorBonuses(majorName);
  console.log("Major manually chosen:", player.major);

  // Ha akarod, rögtön nyithatjuk a kezdő scene-t
  const majorSceneMap = {
    "Psychology": "major_psychology",
    "ComputerScience": "major_cs",
    "Law": "major_law",
    "Business/Management": "major_business",
    "Astronomy": "major_astronomy",
    "Geology": "major_geology",
    "Nursing": "major_nursing"
  };

  currentScene = majorSceneMap[majorName] || "major_psychology";
  lineIndex = 0;
  showLine();
}
const dormRoomScreen = document.getElementById("dormRoomScreen");
const dormStats = document.getElementById("dormStats");
const restBtn = document.getElementById("restBtn");
const exitDormBtn = document.getElementById("exitDormBtn");
const questList = document.getElementById("questList");


exitDormBtn.onclick = () => {
  console.log("[dorm] exitDormBtn clicked. currentScene before:", currentScene, "lineIndex:", lineIndex);

  // bezárjuk a dorm képernyőt
  dormRoomScreen.style.display = "none";
  mainGame.style.display = "block";

  // kis késleltetés, hogy minden DOM frissüljön rendesen
  setTimeout(() => {
    console.log("[dorm] calling advanceStory('next_day_morning')...");
    advanceStory("next_day_morning");
    console.log("[dorm] after advanceStory: currentScene:", currentScene, "lineIndex:", lineIndex);
  }, 10);
};


// Példa questek
let availableQuests = [
  { name: "Tanulás a könyvtárban", rewardType: "knowledge", next: "library_scene" },
  { name: "Beszélgetés a szobatárssal", rewardType: "social", next: "roommate_scene" },
  { name: "Titkos akció az éjjel", rewardType: "stealth", next: "night_scene" }
];

// Belépés a koli szobába


let dormReturnScene = "next_day_morning"; // alapértelmezett

function enterDormRoom(returnScene = "next_day_morning") {
  dormReturnScene = returnScene;
  mainGame.style.display = "none";
  dormRoomScreen.style.display = "block";
  renderDormRoom();
}

exitDormBtn.onclick = () => {
  dormRoomScreen.style.display = "none";
  mainGame.style.display = "block";
  currentScene = dormReturnScene;   // <-- fontos!
  lineIndex = 0;
  showLine();                       // <-- ezzel indul újra a történet
};


exitDormBtn.onclick = () => {
  dormRoomScreen.style.display = "none";
  mainGame.style.display = "block";
  advanceStory(dormReturnScene);
};


// Kirajzolás
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
      mainGame.style.display = "block";
      advanceStory(q.next);
    };
    questList.appendChild(btn);
  });
}

// Pihenés gomb
restBtn.onclick = () => {
  player.needs.fatigue = Math.max(0, player.needs.fatigue - 50);
  player.needs.hunger = Math.min(100, player.needs.hunger + 10);
  player.needs.thirst = Math.min(100, player.needs.thirst + 10);
  updateStatsDisplay();
  dormStats.innerHTML = `
    🍞 Éhség: ${player.needs.hunger}%<br>
    💧 Szomjúság: ${player.needs.thirst}%<br>
    😴 Fáradtság: ${player.needs.fatigue}%<br>
    📚 Tudás: ${player.knowledge}<br>
    🎉 Szociális: ${player.social}
  `;
  alert("Pihentél egyet. A fáradtság csökkent!");
  saveGame();
};

exitDormBtn.onclick = () => {
  console.log("[Dorm] Kilépés a szobából, folytatás: next_day_morning");
  dormRoomScreen.style.display = "none";
  mainGame.style.display = "block";
  advanceStory("next_day_morning");
};




function applyMajorBonuses(major) {
  switch (major) {
    case "Marketing": player.skills.charisma += 2; player.social += 1; break;
    case "Psychology": player.skills.logic += 2; player.skills.diplomacy += 1; break;
    case "ComputerScience": player.skills.logic += 2; break;
    case "Law": player.skills.logic += 2; player.skills.diplomacy += 1; break;
    case "Astronomy": player.skills.logic += 2; break;
    case "Geology": player.skills.logic += 2; break;
    case "Business/Management": player.skills.logic += 1; player.skills.charisma += 1; player.social += 1; break;
  }
  updateStatsDisplay();
}

// ------------------ MiniGame framework ------------------
let minigameState = null;

// Dispatcher
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
    case "firstaid": // 🔥 új típus
      startFirstAidMinigame(config.successNext, config.failNext);
      break;
    case "rock": // új típus
      startRockMinigame(config.successNext, config.failNext);
      break;
    default:
      console.warn("Unknown minigame type:", type);
      break;
  }
}

function startFirstAidMinigame(successNext, failNext) {
  new FirstAidMinigame(
    () => { currentScene = successNext; lineIndex = 0; showLine(); },
    () => { currentScene = failNext; lineIndex = 0; showLine(); }
  );
}






// ------------------ Café Minigame ------------------
function startCafeMinigame(config) {
  mainGame.style.display = "none";
  minigameScreen.style.display = "block";
  minigameResult.textContent = "";
  ordersContainer.innerHTML = "";
  minigameTitle.textContent = "Café Shift";

  const difficulty = config.difficulty || "easy";
  const settings = {
    duration: difficulty === "easy" ? 12 : 8,
    spawnInterval: difficulty === "easy" ? 1200 : 800,
    maxActiveOrders: difficulty === "easy" ? 4 : 6,
    rewardPerOrder: difficulty === "easy" ? 10 : 15
  };

  // Shared state
  minigameState = { type: "cafe", settings, timeLeft: settings.duration, activeOrders: 0, served: 0, intervalIds: [] };
  minigameTime.textContent = minigameState.timeLeft;

  // Spawn orders loop
  const spawnLoop = setInterval(() => {
    if (minigameState.activeOrders < settings.maxActiveOrders) spawnCafeOrder();
  }, settings.spawnInterval);
  minigameState.intervalIds.push(spawnLoop);

  // Countdown
  const countdown = setInterval(() => {
    minigameState.timeLeft--;
    minigameTime.textContent = minigameState.timeLeft;
    if (minigameState.timeLeft <= 0) endCafeMinigame();
  }, 1000);
  minigameState.intervalIds.push(countdown);

  // Quit button
  minigameQuit.onclick = () => endCafeMinigame(true);

  function spawnCafeOrder() {
    const orderId = `order_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    const btn = document.createElement("button");
    btn.className = "orderBtn";
    const orderText = ["Sandwich","Coffee","Juice","Wrap","Salad"][Math.floor(Math.random()*5)];
    btn.textContent = orderText;
    btn.id = orderId;
    ordersContainer.appendChild(btn);
    minigameState.activeOrders++;

    btn.onclick = () => {
      minigameState.served++;
      minigameState.activeOrders--;
      if (btn.parentNode) btn.parentNode.removeChild(btn);
      player.money += settings.rewardPerOrder;
      player.social += 1;
      updateStatsDisplay();
    };

    // Auto-expire
    setTimeout(() => {
      const el = document.getElementById(orderId);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
        minigameState.activeOrders = Math.max(0, minigameState.activeOrders - 1);
      }
    }, settings.spawnInterval * 5);
  }

  // initial orders
  for (let i=0;i<Math.min(2, settings.maxActiveOrders);i++) spawnCafeOrder();

  function endCafeMinigame(quit=false) {
    minigameState.intervalIds.forEach(id => clearInterval(id));
    minigameState.intervalIds = [];
    const served = minigameState.served;
    const reward = served * settings.rewardPerOrder;
    minigameResult.textContent = quit ? `You quit. Served ${served} orders.` : `Shift over! You served ${served} orders and earned ${reward} Unicoin.`;
    if (!quit) {
      player.knowledge += Math.floor(served/2);
      player.social += Math.floor(served/3);
      updateStatsDisplay();
    }
    ordersContainer.innerHTML = "";
    setTimeout(() => {
      minigameScreen.style.display = "none";
      mainGame.style.display = "block";
      if (config.nextScene) {
        currentScene = config.nextScene;
        lineIndex = 0;
      }
      showLine();
      saveGame();
    }, 1400);
  }
}

class RockMinigame {
  constructor(successCallback, failCallback) {
    this.successCallback = successCallback;
    this.failCallback = failCallback;
    this.createUI();
  }

  createUI() {
    this.container = document.createElement("div");
    Object.assign(this.container.style, { position: "fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.7)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", zIndex:"9999" });

    const img = document.createElement("img");
    img.src = "rocks/rock1.png"; // ide jön a random rock
    img.style.width = "200px";
    img.style.height = "200px";
    this.container.appendChild(img);

    const options = ["Granite", "Basalt", "Sandstone"];
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.style.margin = "10px";
      btn.onclick = () => this.checkAnswer(opt);
      this.container.appendChild(btn);
    });

    document.body.appendChild(this.container);
  }

  checkAnswer(choice) {
    if (choice === "Granite") this.successCallback();
    else this.failCallback();
    if (this.container.parentNode) this.container.remove();
  }
}


function startRockMinigame(successNext, failNext) {
  const rock = rocks[Math.floor(Math.random() * rocks.length)];
  const options = [rock.name];

  // Véletlenszerű "hamis" nevek
  while (options.length < 3) {
    const fake = rocks[Math.floor(Math.random() * rocks.length)].name;
    if (!options.includes(fake)) options.push(fake);
  }
  options.sort(() => Math.random() - 0.5);

  // UI
  const container = document.createElement("div");
  Object.assign(container.style, {position:"fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.7)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", zIndex:9999});
  
  const img = document.createElement("img");
  img.src = `images/${rock.image}`;
  img.style.width = "200px";
  container.appendChild(img);

  options.forEach(name => {
    const btn = document.createElement("button");
    btn.innerText = name;
    btn.style.margin = "10px";
    btn.onclick = () => {
      if (container.parentNode) container.remove();
      if (name === rock.name) {
        currentScene = successNext;
      } else {
        currentScene = failNext;
      }
      lineIndex = 0;
      showLine();
    };
    container.appendChild(btn);
  });

  document.body.appendChild(container);
}


// ------------------ Job launcher (helper) ------------------
function startJob(jobType, requiredLevel = 0) {
  switch (jobType) {
    case "Waiter":
      startMinigame("cafe", { difficulty: "easy" });
      break;
    case "Internship":
      if (player.knowledge >= requiredLevel) {
        player.money += 100; player.knowledge += 1;
        alert("Internship successful! Earned 100 Unicoin and knowledge +1.");
      } else alert("Not qualified for this internship yet.");
      break;
    default:
      alert("Job not implemented yet.");
  }
  updateStatsDisplay();
  saveGame();
}

// quick test button visibility (for debug)
if (startCafeBtn) {
  startCafeBtn.style.display = "inline-block";
  startCafeBtn.onclick = () => startMinigame("cafe", { difficulty: "easy" });
}

// ------------------ Save / Load / Reset ------------------
function saveGame() {
  const saveData = { player, currentScene, lineIndex };
  try {
    localStorage.setItem("vn_save", JSON.stringify(saveData));
    console.log("Game saved!");
  } catch (err) {
    console.error("Save failed:", err);
    alert("Save failed — local storage may be full.");
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
    mainGame.style.display = "block";
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
  choicesBox.innerHTML = ""; // clear old choices
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

// ------------------ Click handler (single, fixed) ------------------
textBox.onclick = () => {
  const scene = scenes[currentScene];
  if (!scene) return;
  const line = scene[lineIndex];
  if (!line) return;

  // If this line has choices, display them and wait for user interaction
  if (line.choice) {
    displayChoices(line.choice);  // Ki kell jeleníteni a választásokat
    return;  // Várni kell, hogy a felhasználó válasszon
  }
  
  // Otherwise advance (showLine will handle incrementing the index)
  showLine();
};
