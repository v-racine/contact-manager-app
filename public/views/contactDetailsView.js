import { form, contactContainer, message } from "./domElements.js";
import { contactTemplate } from "./contactTemplate.js";
import { showNotification } from "./notifications.js";

const GENERIC_ERROR_MESSAGE =
  "Sorry, something went wrong. Please try again later.";

export function renderContactDetail(
  contactData,
  { onEdit, onDelete, onTagClick } = {},
) {
  contactContainer.appendChild(
    contactTemplate(contactData, { onEdit, onDelete, onTagClick }),
  );
}

export function clearContactDetailView() {
  form.style.display = "none";
  message.textContent = "";
  contactContainer.textContent = "";
}

export function showError() {
  showNotification(GENERIC_ERROR_MESSAGE, "error");
}
