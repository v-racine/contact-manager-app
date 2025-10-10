import { message } from "./domElements.js";

let notificationTimeout;

export function showNotification(text, type = "success", duration = 4000) {
  if (!message) return;

  clearTimeout(notificationTimeout);

  message.textContent = text;
  message.classList.remove("has-text-danger", "has-text-success", "is-hidden");

  if (type === "error") {
    message.classList.add("has-text-danger");
  } else {
    message.classList.add("has-text-success");
  }

  if (duration > 0) {
    notificationTimeout = setTimeout(() => {
      message.textContent = "";
      message.classList.add("is-hidden");
    }, duration);
  }
}
