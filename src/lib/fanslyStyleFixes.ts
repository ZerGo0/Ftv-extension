import css from '@/assets/fanslyStyleFixes.css?inline';

const elementId = 'ftv-fansly-style-fixes-css';

export function fanslyStyleFixes(ctx: any) {
  if (document.getElementById(elementId)) {
    return;
  }

  const style = document.createElement('style');
  style.id = elementId;
  style.media = 'screen';
  style.innerHTML = css;
  document.head.appendChild(style);
}
