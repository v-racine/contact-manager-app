export function initViewAllContactsButton(onClick) {
  const button = document.getElementById("view-all-btn");
  if (!button) return;

  button.addEventListener("click", onClick);
}
