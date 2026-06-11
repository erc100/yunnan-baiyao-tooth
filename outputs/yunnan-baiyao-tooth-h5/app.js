const screens = {
  intro: document.getElementById("intro-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen"),
};

const els = {
  startButton: document.getElementById("start-button"),
  toothIcon: document.getElementById("tooth-icon"),
  resultTooth: document.getElementById("result-tooth"),
  statusText: document.getElementById("status-text"),
  progressRow: document.getElementById("progress-row"),
  sceneStage: document.getElementById("scene-stage"),
  sceneArt: document.getElementById("scene-art"),
  sceneTime: document.getElementById("scene-time"),
  sceneTitle: document.getElementById("scene-title"),
  questionKicker: document.getElementById("question-kicker"),
  questionTitle: document.getElementById("question-title"),
  optionsList: document.getElementById("options-list"),
  feedbackBox: document.getElementById("feedback-box"),
  feedbackText: document.getElementById("feedback-text"),
  tipText: document.getElementById("tip-text"),
  resultLevel: document.getElementById("result-level"),
  resultTitle: document.getElementById("result-title"),
  resultMessage: document.getElementById("result-message"),
  restartButton: document.getElementById("restart-button"),
  shareButton: document.getElementById("share-button"),
  toast: document.getElementById("toast"),
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modal-title"),
  modalMessage: document.getElementById("modal-message"),
  modalButton: document.getElementById("modal-button"),
};

const toothNames = ["健康牙齿", "出现黑缝", "出现小洞", "出现大洞", "牙冠全没有"];

const questions = [
  {
    time: "早晨浴室",
    title: "对镜刷牙",
    sceneClass: "scene-bathroom",
    art: "bathroom",
    question: "刷牙的最佳时长是？",
    options: [
      { key: "A", text: "30秒", correct: false },
      { key: "B", text: "两分钟", correct: true },
      { key: "C", text: "五分钟", correct: false },
    ],
    correctFeedback: "✅ 正确！2分钟最科学。",
    wrongFeedback: "❌ 错误！最佳时长是2分钟。",
  },
  {
    time: "早晨浴室",
    title: "用力横刷",
    sceneClass: "scene-bathroom scene-bad-brush",
    art: "bathroom",
    question: "正确的刷牙方式是？",
    options: [
      { key: "A", text: "横刷拉锯式", correct: false },
      { key: "B", text: "加大摩擦力", correct: false },
      { key: "C", text: "巴氏刷牙法", correct: true },
    ],
    correctFeedback: "✅ 正确！巴氏刷牙法最有效。",
    wrongFeedback: "❌ 错误！推荐巴氏刷牙法（45度颤动）。",
  },
  {
    time: "夜晚客厅",
    title: "睡前吃薯片",
    sceneClass: "chips-scene",
    art: "chips",
    question: "现在应该怎么做？",
    options: [
      { key: "A", text: "立刻去睡觉", correct: false },
      { key: "B", text: "去刷牙", correct: true },
    ],
    correctFeedback: "✅ 正确！睡前必须刷牙清除残渣。",
    wrongFeedback: "❌ 错误！不刷牙就睡觉会导致蛀牙。",
    wrongTip: "正确做法是：去刷牙",
    showSqueezeOnWrong: true,
  },
  {
    time: "饭后桌边",
    title: "喝完可乐",
    sceneClass: "cola-scene",
    art: "cola",
    question: "刚喝完碳酸饮料，应该怎么做？",
    options: [
      { key: "A", text: "立刻去刷牙", correct: false },
      { key: "B", text: "喝口水漱口并等待半小时", correct: true },
    ],
    correctFeedback: "✅ 正确！",
    wrongFeedback: "❌ 错误！立刻刷牙会磨损软化的牙釉质。",
    tip: "📌 吃完酸性食物不要立刻刷牙，牙釉质软化刷牙会磨损，漱口等待半小时再刷。",
  },
  {
    time: "镜前观察",
    title: "牙齿变黄",
    sceneClass: "yellow-scene",
    art: "yellow",
    question: "牙齿变黄了，最好怎么办？",
    options: [
      { key: "A", text: "不用管它自己会消失", correct: false, branch: "yellowBad" },
      { key: "B", text: "去牙科洗牙", correct: true, branch: "cleaning" },
      { key: "C", text: "用云南白药牙膏", correct: true, branch: "productCare" },
    ],
  },
];

let currentQuestion = 0;
let toothLevel = 0;
let isYellow = false;
let answers = [];
let toastTimer = 0;

function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle("is-active", key === name);
  });
}

function encodeSvg(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function toothSvg(level, yellow = false) {
  const enamel = yellow ? "#f2d36f" : "#ffffff";
  const shade = yellow ? "#d8a93c" : "#bfeaf6";
  const stroke = "#0b76ad";
  const gum = "#ff9aa5";
  const hole = "#27384a";
  const crack = "#1c2f40";
  const stains = yellow
    ? `<path d="M48 68c13 7 31 7 44 0" fill="none" stroke="#bf8e2d" stroke-width="5" stroke-linecap="round" opacity=".44"/>
       <circle cx="48" cy="86" r="5" fill="#c89a33" opacity=".34"/>
       <circle cx="87" cy="88" r="4" fill="#c89a33" opacity=".3"/>`
    : "";

  if (level === 4) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" role="img" aria-label="牙冠全没有">
      <rect width="140" height="140" rx="24" fill="#effcff"/>
      <path d="M28 86c8-18 27-28 42-20 15-8 34 2 42 20 7 16-1 31-17 35-9 3-18-1-25-8-7 7-16 11-25 8-16-4-24-19-17-35z" fill="${gum}" stroke="#df6879" stroke-width="5"/>
      <path d="M44 77c8-5 17-4 26 2 9-6 18-7 26-2" fill="none" stroke="#8b2531" stroke-width="5" stroke-linecap="round"/>
      <path d="M42 62c9 7 18 9 28 4 10 5 19 3 28-4" fill="none" stroke="${hole}" stroke-width="9" stroke-linecap="round"/>
      <path d="M34 101h72" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".35"/>
    </svg>`;
  }

  const damage = [
    "",
    `<path d="M69 43c-4 12 5 20 0 32" fill="none" stroke="${crack}" stroke-width="5" stroke-linecap="round"/>
     <path d="M62 54l11 6-10 7" fill="none" stroke="${crack}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M69 43c-4 12 5 20 0 32" fill="none" stroke="${crack}" stroke-width="5" stroke-linecap="round"/>
     <circle cx="84" cy="76" r="12" fill="${hole}"/>
     <circle cx="80" cy="72" r="4" fill="#516172"/>`,
    `<path d="M65 41c-8 16 8 27 1 45" fill="none" stroke="${crack}" stroke-width="6" stroke-linecap="round"/>
     <circle cx="84" cy="79" r="20" fill="${hole}"/>
     <circle cx="78" cy="71" r="6" fill="#526170"/>
     <path d="M42 94c10 9 22 12 33 6" fill="none" stroke="${crack}" stroke-width="5" stroke-linecap="round"/>`,
  ][level];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" role="img" aria-label="${toothNames[level]}">
    <rect width="140" height="140" rx="24" fill="#effcff"/>
    <path d="M37 20c12-7 24-2 33 8 9-10 21-15 33-8 20 12 18 45 8 75-9 27-22 31-34 8-3-6-11-6-14 0-12 23-25 19-34-8-10-30-12-63 8-75z" fill="${enamel}" stroke="${stroke}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M42 25c8-3 18 1 28 11 10-10 20-14 28-11" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity=".74"/>
    <path d="M41 95c7 18 15 19 24 2 3-7 12-7 16 0 9 17 17 16 24-2" fill="none" stroke="${shade}" stroke-width="5" stroke-linecap="round" opacity=".5"/>
    ${stains}
    ${damage}
  </svg>`;
}

function updateToothDisplay() {
  const src = encodeSvg(toothSvg(toothLevel, isYellow));
  els.toothIcon.src = src;
  els.resultTooth.src = src;
  const yellowText = isYellow ? " + 黄色污渍" : "";
  els.statusText.textContent = `${toothNames[toothLevel]}${yellowText}`;
}

function applyPenalty() {
  toothLevel = Math.min(4, toothLevel + 1);
  updateToothDisplay();
}

function makeYellow() {
  isYellow = true;
  updateToothDisplay();
}

function renderProgress() {
  els.progressRow.innerHTML = "";
  questions.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "progress-dot";
    if (index < currentQuestion) dot.classList.add("is-done");
    if (index === currentQuestion) dot.classList.add("is-active");
    els.progressRow.appendChild(dot);
  });
}

function sceneMarkup(type) {
  if (type === "chips") {
    return `<div class="tv"></div><div class="sofa-person"></div>`;
  }

  if (type === "cola") {
    return `<div class="glass"></div>`;
  }

  return `<div class="person">
    <div class="hair"></div>
    <div class="head"></div>
    <div class="mouth"></div>
    <div class="body"></div>
    <div class="arm"></div>
    <div class="brush"></div>
  </div>`;
}

function renderQuestion() {
  const item = questions[currentQuestion];
  renderProgress();
  els.sceneTime.textContent = item.time;
  els.sceneTitle.textContent = item.title;
  els.sceneArt.className = `mirror-scene ${item.sceneClass}`;
  els.sceneArt.innerHTML = sceneMarkup(item.art);
  els.questionKicker.textContent = `第 ${currentQuestion + 1} 题`;
  els.questionTitle.textContent = item.question;
  els.feedbackBox.hidden = true;
  els.feedbackText.textContent = "";
  els.tipText.hidden = true;
  els.tipText.textContent = "";
  els.optionsList.innerHTML = "";

  item.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.type = "button";
    button.innerHTML = `<span class="letter">${option.key}</span><span>${option.text}</span>`;
    button.addEventListener("click", () => handleAnswer(option, button));
    els.optionsList.appendChild(button);
  });
}

function setFeedback(message, tip = "") {
  els.feedbackBox.hidden = false;
  els.feedbackText.textContent = message;
  els.tipText.hidden = !tip;
  els.tipText.textContent = tip;
}

function disableOptions(selectedButton, selectedOption) {
  [...els.optionsList.querySelectorAll("button")].forEach((button) => {
    button.disabled = true;
    const key = button.querySelector(".letter").textContent;
    const option = questions[currentQuestion].options.find((item) => item.key === key);
    if (option.correct) button.classList.add("is-correct");
  });
  selectedButton.classList.add(selectedOption.correct ? "is-correct" : "is-wrong");
}

function handleAnswer(option, selectedButton) {
  const item = questions[currentQuestion];
  disableOptions(selectedButton, option);
  answers.push({
    question: currentQuestion + 1,
    answer: option.key,
    correct: option.correct,
  });

  if (currentQuestion === 4) {
    handleFinalQuestion(option);
    return;
  }

  if (option.correct) {
    setFeedback(item.correctFeedback, item.tip || "");
  } else {
    applyPenalty();
    setFeedback(item.wrongFeedback, item.wrongTip || item.tip || "");
    if (item.showSqueezeOnWrong) showSqueezeHint();
  }

  window.setTimeout(nextQuestion, item.tip || item.wrongTip ? 2200 : 1500);
}

function showSqueezeHint() {
  const overlay = document.createElement("div");
  overlay.className = "squeeze-overlay";
  overlay.innerHTML = `<img src="./assets/product-tube.png" alt="" /><span></span><strong>挤上云南白药牙膏，睡前认真清洁</strong>`;
  els.sceneStage.appendChild(overlay);
  window.setTimeout(() => overlay.remove(), 1900);
}

function nextQuestion() {
  currentQuestion += 1;
  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }
  renderQuestion();
}

function handleFinalQuestion(option) {
  if (option.branch === "yellowBad") {
    applyPenalty();
    makeYellow();
    setFeedback("❌ 错误！牙齿变黄不会自己消失。", "⚠️ 你的牙齿不仅损坏加重，还留下了黄色污渍。");
    window.setTimeout(showResult, 2200);
    return;
  }

  if (option.branch === "cleaning") {
    isYellow = false;
    updateToothDisplay();
    setFeedback("✅ 正确！洗牙能去除色素和牙结石。", "不可频繁洗牙哦。日常清洁也要坚持。");
    window.setTimeout(showResult, 1900);
    return;
  }

  isYellow = false;
  updateToothDisplay();
  setFeedback("✨ 正确！你选择用云南白药牙膏坚持日常清洁。", "光钻白专研，帮助减少色渍困扰；已有黑缝/小洞仍要及时看牙医。");
  window.setTimeout(showResult, 2200);
}

function getResultCopy() {
  if (toothLevel === 4) {
    return {
      title: "严重损坏",
      message: "💀💀💀 牙齿已严重损坏，必须进行修复治疗。",
    };
  }

  if (toothLevel === 0 && !isYellow) {
    return {
      title: "完美笑容",
      message: "🎉 完美！牙齿健康又白净，继续保持！",
    };
  }

  if (toothLevel === 0 && isYellow) {
    return {
      title: "色渍预警",
      message: "⚠️ 牙齿变黄了，注意少吃色素食物或洗牙。",
    };
  }

  if ((toothLevel === 1 || toothLevel === 2) && !isYellow) {
    return {
      title: "轻微风险",
      message: "⚠️ 牙齿有轻微问题，改进刷牙习惯吧。",
    };
  }

  if ((toothLevel === 1 || toothLevel === 2) && isYellow) {
    return {
      title: "清洁拉警报",
      message: "😷 牙齿又黄又有小问题，需要美白+清洁改进。",
    };
  }

  if (toothLevel === 3 && !isYellow) {
    return {
      title: "尽快补牙",
      message: "🔥 牙齿有大洞，尽快去看牙医补牙！",
    };
  }

  return {
    title: "立即就医",
    message: "💀 牙齿又黄又有大洞，非常危险，立即就医！",
  };
}

function showResult() {
  updateToothDisplay();
  const copy = getResultCopy();
  els.resultLevel.textContent = `等级 ${toothLevel} · ${toothNames[toothLevel]}${isYellow ? " · 变黄" : ""}`;
  els.resultTitle.textContent = copy.title;
  els.resultMessage.textContent = copy.message;
  showScreen("result");
}

function resetAll() {
  currentQuestion = 0;
  toothLevel = 0;
  isYellow = false;
  answers = [];
  updateToothDisplay();
  renderQuestion();
  showScreen("quiz");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    els.toast.hidden = true;
  }, 2100);
}

function showModal(title, message, buttonText, onConfirm) {
  els.modalTitle.textContent = title;
  els.modalMessage.textContent = message;
  els.modalButton.textContent = buttonText;
  els.modal.hidden = false;
  els.modalButton.onclick = () => {
    els.modal.hidden = true;
    onConfirm();
  };
}

async function shareResult() {
  const copy = getResultCopy();
  const text = `我完成了云南白药牙膏牙齿清洁度测试：等级${toothLevel}，${copy.message}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "牙齿清洁度测试",
        text,
      });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("结果文案已复制，可以去分享啦");
  } catch {
    showToast(text);
  }
}

els.startButton.addEventListener("click", resetAll);
els.restartButton.addEventListener("click", resetAll);
els.shareButton.addEventListener("click", shareResult);

updateToothDisplay();
renderQuestion();
