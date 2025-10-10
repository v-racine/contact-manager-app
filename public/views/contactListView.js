import { form, contactContainer, message } from "./domElements.js";
import { contactTemplate } from "./contactTemplate.js";

export function renderAllContacts(
  contacts,
  { onEdit, onDelete, onTagClick } = {},
) {
  form.style.display = "none";
  message.textContent = "";
  contactContainer.textContent = "";

  const fragment = document.createDocumentFragment();
  contacts.forEach((contact) => {
    fragment.appendChild(
      contactTemplate(contact, { onEdit, onDelete, onTagClick }),
    );
  });
  contactContainer.appendChild(fragment);
}
