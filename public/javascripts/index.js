const baseURL = "http://localhost:3000";

//GET fetch for contacts
const fetchData = async (path) => {
  try {
    const url = new URL(baseURL + path);
    // url.search = new URLSearchParams({
    //   ...params,
    // });

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

//all contacts search
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

document.addEventListener("click", (e) => {
  if (!searchInputEle.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});

//single contact selection
const onContactSelect = async (contactId) => {
  const contactData = await fetchData(`/api/contacts/${contactId}`);

  if (!contactData) return;

  const contactContainer = document.querySelector(".contact-container");
  contactContainer.appendChild(contactTemplate(contactData));

  console.log(contactData);
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
  pPhone.textContent = contactData.phone_number;

  content.append(h4, pEmail, pPhone);
  mediaContent.appendChild(content);
  article.appendChild(mediaContent);

  return article;
};

//Add new contact
const addContactBtn = document.querySelector("#add-contact");
const form = document.querySelector("form");

addContactBtn.addEventListener("click", (e) => {
  form.style.display = "block";
});
