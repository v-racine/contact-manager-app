import { message } from "./domElements.js";

export function showNotification(text, type = "success", duration = 4000) {
  if (!message) return;

  message.textContent = text;
  message.classList.remove("has-text-danger", "has-text-success", "is-hidden");

  if (type === "error") {
    message.classList.add("has-text-danger");
  } else {
    message.classList.add("has-text-success");
  }

  if (duration > 0) {
    setTimeout(() => {
      message.textContent = "";
      message.classList.add("is-hidden");
    }, duration);
  }
}
