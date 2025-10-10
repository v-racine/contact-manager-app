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
      tags: formData.get("tags" || ""),
    };

    _onFormSubmit(contact);
  });

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
  form.tags.value = contact.tags;
}

export function setFormMode(mode = "create") {
  submitBtn.textContent = mode === "edit" ? "Update Contact" : "Add Contact";
}

export function validateForm(contact) {
  const errors = [];

  if (!contact.full_name) {
    errors.push("Full name is required.");
  }

  if (!contact.email) {
    errors.push("Email is required.");
  } else if (!/^\S+@\S+\.\S+$/.test(contact.email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!contact.phone_number) {
    errors.push("Phone number is required.");
  }
  // } else if (!/^\d{3}-\d{3}-\d{4}$/.test(contact.phone_number)) {
  //   errors.push("Phone number must be in the format: '123-456-7890'.");
  // }

  return errors;
}
