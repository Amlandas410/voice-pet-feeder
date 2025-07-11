const BLYNK_AUTH = "YHYnxLeRlIw15NMc1Dzr3p0j37byCr_e";  // Replace with your actual token
const logDiv = document.getElementById('log');

function log(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

function sendToBlynk(vpin, value) {
  fetch(`https://blynk.cloud/external/api/update?token=${BLYNK_AUTH}&${vpin}=${value}`)
    .then(res => {
      if (res.ok) log(`✅ Sent ${vpin} = ${value}`);
      else log(`❌ Failed to send ${vpin}`);
    });
}

function getFromBlynk(vpin) {
  fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_AUTH}&${vpin}`)
    .then(res => res.text())
    .then(data => log(`📊 ${vpin} = ${data}`))
    .catch(() => log("❌ Failed to fetch data"));
}

function triggerAction(command) {
  if (command.includes("feed")) {
    sendToBlynk("V2", 1);
    log("🐾 Feeding triggered!");
  } else if (command.includes("sync")) {
    sendToBlynk("V7", 1);
    log("⏱️ Time sync requested.");
  } else if (command.includes("status")) {
    getFromBlynk("V6");
  } else {
    log("🤖 Unrecognized command.");
  }
}

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;
recognition.continuous = true;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
  const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
  log("🎧 Heard: " + command);
  triggerAction(command);
};

recognition.onerror = (e) => {
  log("❌ Error: " + e.error);
};

recognition.onend = () => {
  log("🔁 Restarting voice recognition...");
  recognition.start();
};

recognition.start();
log("🎤 Voice assistant started.");