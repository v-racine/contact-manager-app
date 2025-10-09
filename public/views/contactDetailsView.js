import { form, contactContainer, message, messageBox } from "./domElements.js";
import { contactTemplate } from "./contactTemplate.js";

const GENERIC_ERROR_MESSAGE =
  "Sorry, something went wrong. Please try again later.";

export function renderContactDetail(contactData) {
  contactContainer.appendChild(contactTemplate(contactData));
}

export function clearContactDetailView() {
  form.style.display = "none";
  message.textContent = "";
  contactContainer.textContent = "";
}

export function showError() {
  message.textContent = GENERIC_ERROR_MESSAGE;
}
