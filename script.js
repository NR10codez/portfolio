/* script.js - page behaviour: scroll progress, pointer position, skill info text */
var state = { progress: 0, mx: 0, my: 0, onClick: null };

function setPointer(e) {
  var t = e.touches ? e.touches[0] : e;
  state.mx = (t.clientX / window.innerWidth - 0.5) * 2;
  state.my = -(t.clientY / window.innerHeight - 0.5) * 2;
}

function updateScroll() {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  state.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  var hint = document.querySelector(".hint");
  if (hint) hint.style.opacity = state.progress > 0.03 ? "0" : "1";
}

function showSkill(name, text) {
  document.getElementById("skillinfo").textContent = name + ": " + text;
}

window.addEventListener("mousemove", setPointer);
window.addEventListener("click", function (e) {
  setPointer(e);
  if (state.onClick) state.onClick();
});
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();
