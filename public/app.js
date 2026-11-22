const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll("main > .panel");
const result = document.getElementById("result");
let lastResult = "";

tabs.forEach(btn => btn.addEventListener("click", () => {
  tabs.forEach(t => t.classList.toggle("active", t === btn));
  panels.forEach(p => p.classList.toggle("hidden", p.id !== btn.dataset.tab));
  result.classList.add("hidden");
}));

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message; el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 3500);
}

const questions = [
  ["What do you usually do during your day?", "O que você costuma fazer durante o seu dia?"],
  ["What is the most challenging part of your job?", "Qual é a parte mais desafiadora do seu trabalho?"],
  ["Tell me about something new you learned recently.", "Conte sobre algo novo que aprendeu recentemente."],
  ["What would you like to improve this year?", "O que você gostaria de melhorar neste ano?"],
  ["If you could travel anywhere, where would you go?", "Se pudesse viajar para qualquer lugar, para onde iria?"]
];
document.getElementById("new-question").addEventListener("click", () => {
  const q = questions[Math.floor(Math.random() * questions.length)];
  document.getElementById("conversation-question").textContent = q[0];
  document.querySelector("#conversation .prompt-card p").textContent = q[1];
});

async function coach(task) {
  let text = "";
  if (task === "conversation") text = document.getElementById("conversation-input").value.trim();
  if (task === "writing") text = document.getElementById("writing-input").value.trim();
  if (task === "pronunciation") text = document.getElementById("pronunciation-input").value.trim();
  if (task === "vocabulary") text = "Crie um pequeno exercício de vocabulário intermediário sobre trabalho, manutenção industrial e cotidiano. Faça uma pergunta por vez.";
  if (!text) return toast("Escreva ou dite sua resposta primeiro.");
  const topic = document.getElementById("topic").value;
  const button = document.querySelector(`[data-coach="${task}"]`);
  const old = button.innerHTML;
  button.disabled = true; button.textContent = "Preparando correção...";
  result.classList.remove("hidden");
  document.getElementById("result-content").textContent = "Aguarde enquanto o professor analisa sua resposta...";
  try {
    const response = await fetch("/api/coach", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({task, text, topic})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Erro ao consultar o professor.");
    lastResult = data.answer;
    document.getElementById("result-content").textContent = data.answer;
    result.scrollIntoView({behavior:"smooth", block:"start"});
  } catch (err) {
    document.getElementById("result-content").textContent = err.message;
  } finally {
    button.disabled = false; button.innerHTML = old;
  }
}
document.querySelectorAll("[data-coach]").forEach(b => b.addEventListener("click", () => coach(b.dataset.coach)));
document.getElementById("copy-result").addEventListener("click", async () => {
  if (!lastResult) return;
  try { await navigator.clipboard.writeText(lastResult); toast("Correção copiada."); }
  catch { toast("Não foi possível copiar neste navegador."); }
});

function speechToText(targetId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return toast("Reconhecimento de voz não disponível. Use Chrome ou Edge em uma conexão segura (HTTPS).");
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US"; recognition.interimResults = false; recognition.maxAlternatives = 1;
  recognition.onstart = () => toast("Pode falar em inglês...");
  recognition.onresult = event => {
    document.getElementById(targetId).value = event.results[0][0].transcript;
    toast("Voz convertida em texto. Revise antes de enviar.");
  };
  recognition.onerror = () => toast("Não consegui reconhecer. Verifique a permissão do microfone e tente novamente.");
  recognition.start();
}
document.getElementById("speak-conversation").addEventListener("click", () => speechToText("conversation-input"));
document.getElementById("dictate").addEventListener("click", () => speechToText("pronunciation-input"));
document.getElementById("listen").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return toast("Leitura em voz alta não disponível neste navegador.");
  const utterance = new SpeechSynthesisUtterance(document.getElementById("pronunciation-sentence").textContent);
  utterance.lang = "en-US"; utterance.rate = 0.88; speechSynthesis.speak(utterance);
});
