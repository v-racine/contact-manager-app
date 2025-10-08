export const contactTemplate = (contactData) => {
  const article = document.createElement("article");
  article.className = "contact";

  const mediaContent = document.createElement("div");
  mediaContent.className = "contact-content";

  const content = document.createElement("div");
  content.className = "content";

  const h2 = document.createElement("h2");
  h2.textContent = contactData.full_name;

  const pEmail = document.createElement("p");
  pEmail.textContent = contactData.email;

  const pPhone = document.createElement("p");
  pPhone.textContent = `Phone #: ${contactData.phone_number}`;

  const editBtn = document.createElement("button");
  editBtn.className = "button is-info is-light is-small is-rounded";
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "button is-danger is-light is-small is-rounded";
  deleteBtn.textContent = "Delete";

  content.append(h2, pEmail, pPhone, editBtn, deleteBtn);
  mediaContent.appendChild(content);
  article.appendChild(mediaContent);

  return article;
};
