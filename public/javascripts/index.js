const GENERIC_ERROR_MESSAGE =
  "Sorry, something went wrong. Please try again later.";

const searchInputEle = document.querySelector("#search-input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");
const contactContainer = document.querySelector(".contact-container");
const message = document.querySelector("#message-for-user");

document.addEventListener("DOMContentLoaded", () => {
  // Search existing contacts
  const onInput = async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    try {
      const contacts = await fetchData("/api/contacts");

      resultsWrapper.innerHTML = "";

      const filteredContacts = contacts.filter((contact) => {
        return contact.full_name.toLowerCase().includes(searchTerm);
      });

      if (!filteredContacts.length || !searchTerm) {
        dropdown.classList.remove("is-active");
      } else {
        dropdown.classList.add("is-active");
      }

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
    } catch (error) {
      message.textContent = GENERIC_ERROR_MESSAGE;
      console.error("Could not search contacts:", error);
      return;
    }
  };

  searchInputEle.addEventListener("input", debounce(onInput));

  //Click out of search's dropdown menu
  document.addEventListener("click", (e) => {
    if (!searchInputEle.contains(e.target)) {
      dropdown.classList.remove("is-active");
      searchInputEle.value = "";
    }
  });

  //Display all contacts
  const allContactsBtn = document.querySelector("#all-contacts");

  const onAllContacts = async () => {
    try {
      const contacts = await fetchData("/api/contacts");

      form.style.display = "none";
      message.textContent = "";
      contactContainer.textContent = "";

      const fragment = document.createDocumentFragment();
      contacts.forEach((contact) => {
        fragment.appendChild(contactTemplate(contact));
      });
      contactContainer.appendChild(fragment);
    } catch (error) {
      message.textContent = GENERIC_ERROR_MESSAGE;
      console.error("Could not fetch all contacts:", error);
      return;
    }

    console.log(contactContainer); //temp for dev
    //edit contact
    //delete contact
  };

  allContactsBtn.addEventListener("click", onAllContacts);

  //Select and display single contact
  const onContactSelect = async (contactId) => {
    try {
      const contactData = await fetchData(`/api/contacts/${contactId}`);

      form.style.display = "none";
      message.textContent = "";
      contactContainer.textContent = "";

      contactContainer.appendChild(contactTemplate(contactData));
    } catch (error) {
      message.textContent = GENERIC_ERROR_MESSAGE;
      console.error(`Could not fetch contact with ID ${contactId}:`, error);
      return;
    }

    console.log(contactContainer); //temp for dev
    //edit contact
    //delete contact
  };

  //Display "new contact" form
  const addContactBtn = document.querySelector("#add-contact");
  const form = document.querySelector("form");

  addContactBtn.addEventListener("click", () => {
    message.textContent = "";
    contactContainer.textContent = "";
    form.style.display = "block";
  });
});
