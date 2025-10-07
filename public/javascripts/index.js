const baseURL = "http://localhost:3000";

//GET fetch for contacts
const fetchData = async (path) => {
  try {
    const url = new URL(baseURL + path);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch data:", error);
    return null;
  }
};

const searchInputEle = document.querySelector("#search-input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");
const contactContainer = document.querySelector(".contact-container");

// contacts search
const onInput = async (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const contacts = await fetchData("/api/contacts");

  if (!contacts) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultsWrapper.innerHTML = "";

  const filteredContacts = contacts.filter((contact) => {
    return contact.full_name.toLowerCase().includes(searchTerm);
  });

  if (!filteredContacts.length || searchTerm) {
    dropdown.classList.remove("is-active");
  }

  dropdown.classList.add("is-active");

  for (let contact of filteredContacts) {
    const option = document.createElement("a");

    option.classList.add("dropdown-item");
    option.textContent = contact.full_name;

    option.addEventListener("click", (e) => {
      dropdown.classList.remove("is-active");
      onContactSelect(contact.id);
    });

    resultsWrapper.appendChild(option);
  }
};

searchInputEle.addEventListener("input", debounce(onInput));

//click out of search's dropdown menu
document.addEventListener("click", (e) => {
  if (!searchInputEle.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});

//all contacts display
const allContactsBtn = document.querySelector("#all-contacts");

const onAllContacts = async () => {
  const contacts = await fetchData("/api/contacts");
  if (!contacts) return;

  contactContainer.textContent = "";
  const fragment = document.createDocumentFragment();

  for (let contact of contacts) {
    const contactDisplay = contactTemplate(contact);
    fragment.appendChild(contactDisplay);
  }

  contactContainer.appendChild(fragment);
};

allContactsBtn.addEventListener("click", onAllContacts);

//single contact selection
const onContactSelect = async (contactId) => {
  const contactData = await fetchData(`/api/contacts/${contactId}`);

  if (!contactData) return;

  contactContainer.textContent = "";
  contactContainer.appendChild(contactTemplate(contactData));
};

const contactTemplate = (contactData) => {
  const article = document.createElement("article");
  article.className = "contact";

  const mediaContent = document.createElement("div");
  mediaContent.className = "contact-content";

  const content = document.createElement("div");
  content.className = "content";

  const h4 = document.createElement("h2");
  h4.textContent = contactData.full_name;

  const pEmail = document.createElement("p");
  pEmail.textContent = contactData.email;

  const pPhone = document.createElement("p");
  pPhone.textContent = `Phone #: ${contactData.phone_number}`;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  content.append(h4, pEmail, pPhone, editBtn, deleteBtn);
  mediaContent.appendChild(content);
  article.appendChild(mediaContent);

  return article;
};

//Add new contact
const addContactBtn = document.querySelector("#add-contact");
const form = document.querySelector("form");

addContactBtn.addEventListener("click", () => {
  contactContainer.textContent = "";
  form.style.display = "block";
});
