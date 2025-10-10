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
  validateForm,
} from "../views/contactFormView.js";
import { initAddContactButton } from "../views/addContactButtonView.js";
import { showNotification } from "../views/notifications.js";

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
    refreshContactListView();
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
      onTagClick: handleTagClick,
    });
  } catch (error) {
    showError();
    console.error(`Could not fetch contact with ID ${contactId}:`, error);
    return;
  }
}

async function handleFormSubmit(contactData) {
  const errors = validateForm(contactData);
  if (errors.length) {
    showFormMessage(errors.join(" "), "is-danger");
    return;
  }

  try {
    if (editingContactId) {
      const updatedContact = await updateContact(editingContactId, contactData);
      const index = allContacts.findIndex(
        (contact) => contact.id === editingContactId
      );
      if (index !== -1) {
        allContacts[index] = updatedContact;
      } else {
        //refetch ONLY if the contact wasn't in the local cache
        allContacts = await getAllContacts();
      }
      refreshContactListView();
      showNotification(`Contact updated: ${updatedContact.full_name}`);
      editingContactId = null;
    } else {
      const newContact = await createContact(contactData);
      allContacts.push(newContact);
      refreshContactListView();
      showNotification(`Contact added: ${newContact.full_name}`);
    }
    resetForm();
    hideForm();
    setFormMode("create");
  } catch (error) {
    showError();
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
    allContacts = allContacts.filter((contact) => contact.id !== contactId);
    refreshContactListView();
    showNotification(`Contact deleted`);
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

function handleTagClick(tag) {
  const filtered = allContacts.filter(
    (contact) =>
      contact.tags &&
      contact.tags
        .split(",")
        .map((t) => t.trim())
        .includes(tag)
  );
  renderAllContacts(filtered, {
    onEdit: handleEditContact,
    onDelete: handleDeleteContact,
    onTagClick: handleTagClick,
  });
}

/**
 * Refreshes the contact list view using the cached `allContacts` data.
 */
function refreshContactListView() {
  renderAllContacts(allContacts, {
    onEdit: handleEditContact,
    onDelete: handleDeleteContact,
    onTagClick: handleTagClick,
  });
}
