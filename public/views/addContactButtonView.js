export function initAddContactButton(onClick) {
  const button = document.getElementById("add-contact");
  if (!button) return;

  button.addEventListener("click", onClick);
}
