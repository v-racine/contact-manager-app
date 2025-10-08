import { contactTemplate } from "../views/contactListView.js";

const form = document.querySelector("form");
const contactContainer = document.querySelector(".contact-container");
const message = document.querySelector("#message-for-user");

export function clearContactDetailView() {
  form.style.display = "none";
  message.textContent = "";
  contactContainer.textContent = "";
}

export function showError() {
  const message = document.querySelector("#message-for-user");
  message.textContent = "Sorry, something went wrong. Please try again later.";
}

export function renderContactDetail(contactData) {
  contactContainer.appendChild(contactTemplate(contactData));
}
