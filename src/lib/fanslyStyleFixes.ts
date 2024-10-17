import css from "@/assets/fanslyStyleFixes.css?inline";

export function fanslyStyleFixes() {
  const style = document.createElement("style");
  style.id = "emote-panel-css";
  style.media = "screen";
  style.innerHTML = css;
  document.head.appendChild(style);
}
