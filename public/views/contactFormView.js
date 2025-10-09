import {
  form,
  contactContainer,
  message,
  messageBox,
  cancelBtn,
  submitBtn,
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
    setFormMode("create");
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

export function fillForm(contact) {
  form.full_name.value = contact.full_name;
  form.email.value = contact.email;
  form.phone.value = contact.phone_number;
}

export function setFormMode(mode = "create") {
  submitBtn.textContent = mode === "edit" ? "Update Contact" : "Add Contact";
}
