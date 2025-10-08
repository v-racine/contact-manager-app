import { getAllContacts, getContact } from "../api/contactsApi.js";
import {
  renderAllContacts,
  contactTemplate,
} from "../views/contactListView.js";
import { initViewAllButton } from "../views/viewAllButtonView.js";
import {
  initSearchView,
  renderSearchResults,
} from "../views/contactSearchView.js";

const form = document.querySelector("form"); // assuming your form exists
const contactContainer = document.querySelector(".contact-container"); // or whatever ID you're using
const message = document.querySelector("#message-for-user");

const GENERIC_ERROR_MESSAGE =
  "Sorry, something went wrong. Please try again later.";
let allContacts = [];

export function initController() {
  initViewAllButton(handleViewAllContacts);

  initSearchView({
    onSearchInput: handleSearchInput,
    onContactSelect: handleContactSelect,
  });

  preloadContacts(); // Preload for search
}

async function preloadContacts() {
  try {
    allContacts = await getAllContacts();
  } catch (err) {
    console.error("Failed to preload contacts", err);
  }
}

async function handleViewAllContacts() {
  try {
    const contacts = await getAllContacts();
    renderAllContacts(contacts);
  } catch (err) {
    message.textContent = GENERIC_ERROR_MESSAGE;
    console.error("Failed to load contacts:", err);
  }
}

async function handleSearchInput(query) {
  try {
    const contacts = await getAllContacts();
    const results = contacts.filter((contact) =>
      contact.full_name.toLowerCase().includes(query.toLowerCase())
    );
    renderSearchResults(results);
  } catch (error) {
    message.textContent = GENERIC_ERROR_MESSAGE;
    console.error("Could not search contacts:", error);
    return;
  }
}

async function handleContactSelect(contactId) {
  try {
    const contactData = await getContact(contactId);

    form.style.display = "none";
    message.textContent = "";
    contactContainer.textContent = "";

    contactContainer.appendChild(contactTemplate(contactData));
  } catch (error) {
    message.textContent = GENERIC_ERROR_MESSAGE;
    console.error(`Could not fetch contact with ID ${contactId}:`, error);
    return;
  }
}
