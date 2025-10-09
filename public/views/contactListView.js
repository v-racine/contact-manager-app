import { form, contactContainer, message } from "./domElements.js";
import { contactTemplate } from "./contactTemplate.js";

export async function renderAllContacts(contacts, { onDelete } = {}) {
  form.style.display = "none";
  message.textContent = "";
  contactContainer.textContent = "";

  const fragment = document.createDocumentFragment();
  contacts.forEach((contact) => {
    fragment.appendChild(contactTemplate(contact, { onDelete }));
  });
  contactContainer.appendChild(fragment);
}
