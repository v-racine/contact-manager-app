import {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
} from "../api/contactsApi.js";
import { renderAllContacts } from "../views/contactListView.js";
import { initViewAllContactsButton } from "../views/allContactsButtonView.js";
import {
  initSearchView,
  renderSearchResults,
} from "../views/contactSearchView.js";
import {
  clearContactDetailView,
  showError,
  renderContactDetail,
} from "../views/contactDetailsView.js";
import {
  initContactFormView,
  showForm,
  hideForm,
  resetForm,
  showFormMessage,
  fillForm,
  setFormMode,
} from "../views/contactFormView.js";
import { initAddContactButton } from "../views/addContactButtonView.js";

let allContacts = []; //cache
let editingContactId = null; //editing tracker

export function initController() {
  initViewAllContactsButton(handleViewAllContacts);

  initSearchView({
    onSearchInput: handleSearchInput,
    onContactSelect: handleContactSelect,
  });

  initContactFormView({ onFormSubmit: handleFormSubmit });
  initAddContactButton(handleAddContactClick);

  preloadContacts(); // Preload for search
}

async function preloadContacts() {
  try {
    allContacts = await getAllContacts();
  } catch (err) {
    showError();
    console.error("Failed to preload contacts", err);
  }
}

async function handleViewAllContacts() {
  try {
    const contacts = await getAllContacts();
    renderAllContacts(contacts, {
      onEdit: handleEditContact,
      onDelete: handleDeleteContact,
    });
  } catch (err) {
    showError();
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
    showError();
    console.error("Could not search contacts:", error);
    return;
  }
}

async function handleContactSelect(contactId) {
  try {
    const contactData = await getContact(contactId);
    clearContactDetailView();
    renderContactDetail(contactData, {
      onEdit: handleEditContact,
      onDelete: handleDeleteContact,
    });
  } catch (error) {
    showError();
    console.error(`Could not fetch contact with ID ${contactId}:`, error);
    return;
  }
}

function refreshContactListView() {
  renderAllContacts(allContacts, {
    onEdit: handleEditContact,
    onDelete: handleDeleteContact,
  });
}

async function handleFormSubmit(contactData) {
  try {
    if (editingContactId) {
      const updatedContact = await updateContact(editingContactId, contactData);
      const index = allContacts.findIndex(
        (contact) => contact.id === editingContactId
      );
      if (index !== -1) {
        allContacts[index] = updatedContact;
      } else {
        // As a fallback, refetch if the contact wasn't in the local cache
        allContacts = await getAllContacts();
      }
      showFormMessage(
        `Contact updated: ${updatedContact.full_name}`,
        "is-success"
      );
      editingContactId = null;
    } else {
      const newContact = await createContact(contactData);
      allContacts.push(newContact);
      showFormMessage(`Contact added: ${newContact.full_name}`, "is-success");
    }

    refreshContactListView();
    resetForm();
    hideForm();
    setFormMode("create");
  } catch (error) {
    showFormMessage("Failed to add or update contact.", "is-danger");
    console.error("Error submitting form:", error);
  }
}

function handleAddContactClick() {
  showForm();
}

async function handleDeleteContact(contactId) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this contact?"
  );
  if (!confirmDelete) return;

  try {
    await deleteContact(contactId);
    // allContacts = await getAllContacts(); // refresh cache
    allContacts = allContacts.filter((contact) => contact.id !== contactId);
    renderAllContacts(allContacts, {
      onEdit: handleEditContact,
      onDelete: handleDeleteContact,
    });
  } catch (error) {
    showError();
    console.error("Failed to delete contact:", error);
  }
}

function handleEditContact(contact) {
  editingContactId = contact.id;
  fillForm(contact);
  setFormMode("edit");
  showForm();
}
