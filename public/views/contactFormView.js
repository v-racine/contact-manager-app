import { form, contactContainer, message } from "./domElements.js";

let _onFormSubmit;

export function initContactFormView({ onFormSubmit }) {
  _onFormSubmit = onFormSubmit;

  // const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const contact = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    _onFormSubmit(contact);
  });
}

export function showForm() {
  message.textContent = "";
  contactContainer.textContent = "";
  if (form) form.style.display = "block";
}

export function resetForm() {
  // const form = document.querySelector("form");
  form.reset();
}

export function showFormMessage(message, type = "is-success") {
  const messageBox = document.querySelector("#form-message");
  messageBox.textContent = message;
  messageBox.className = `notification ${type}`;
}
