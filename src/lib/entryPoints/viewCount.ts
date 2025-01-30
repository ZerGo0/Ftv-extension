const attachedClass = "ftv-view-count-attached";

let hidden = localStorage.getItem("ftv-view-count-hidden") === "true";

export async function viewCount(ctx: any, mutation: MutationRecord) {
  const elem = mutation.target as HTMLElement;

  if (
    !elem ||
    !elem.classList.contains("stream-info") ||
    elem.querySelector(".fa-users") === null ||
    elem.classList.contains(attachedClass)
  ) {
    return;
  }

  elem.classList.add(attachedClass);

  // find the child element "fa-users" i-element as a child of elem
  const viewCountElem = elem.querySelector(".fa-users")
    ?.parentElement as HTMLDivElement;
  if (viewCountElem) {
    viewCountElem.style.cursor = "pointer";

    if (hidden) {
      hideViewCount(viewCountElem);
    }

    viewCountElem?.addEventListener("click", () => {
      hidden = !hidden;
      localStorage.setItem("ftv-view-count-hidden", hidden.toString());

      if (hidden) {
        hideViewCount(viewCountElem);
      } else {
        showViewCount(viewCountElem);
      }
    });
  }
}

function hideViewCount(viewCountElem: HTMLDivElement) {
  viewCountElem.classList.add("ftv-view-count-blurred");
  const span = document.createElement("span");
  span.textContent = "696969";
  span.classList.add("ftv-view-count-pseudo");
  viewCountElem.appendChild(span);
}

function showViewCount(viewCountElem: HTMLDivElement) {
  viewCountElem.classList.remove("ftv-view-count-blurred");
  viewCountElem.querySelector(".ftv-view-count-pseudo")?.remove();
}
