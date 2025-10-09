import {
  form,
  contactContainer,
  message,
  messageBox,
  cancelBtn,
} from "./domElements.js";

let _onFormSubmit;

export function initContactFormView({ onFormSubmit }) {
  if (!form) return;

  _onFormSubmit = onFormSubmit;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const contact = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone_number: formData.get("phone"),
    };

    _onFormSubmit(contact);
  });

  // 🧼 Cancel button clears and hides form
  cancelBtn.addEventListener("click", () => {
    resetForm();
    hideForm();
  });
}

export function showForm() {
  message.textContent = "";
  contactContainer.textContent = "";
  messageBox.style.display = "none";
  if (form) form.style.display = "block";
}

export function resetForm() {
  if (form) form.reset();
}

export function hideForm() {
  if (form) form.style.display = "none";
}

export function showFormMessage(message, type = "is-success") {
  if (!messageBox) return;
  messageBox.style.display = "block";
  messageBox.textContent = message;
  messageBox.className = `notification ${type}`;
}
