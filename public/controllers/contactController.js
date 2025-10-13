import * as contactsApi from "../api/contactsApi.js";
import { ContactService } from "../services/contactService.js";
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

const contactService = new ContactService(contactsApi);

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
    await contactService.preloadContacts();
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
    const results = contactService.filterContactsByQuery(query);

    renderSearchResults(results);
  } catch (error) {
    showError();
    console.error("Could not search contacts:", error);
    return;
  }
}

async function handleContactSelect(contactId) {
  try {
    const contactData = await contactService.getContactDetail(contactId);

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
    const editingId = contactService.getEditingContactId();
    let resultContact;

    if (editingId) {
      resultContact = await contactService.updateContact(contactData);

      refreshContactListView();
      showNotification(`Contact updated: ${resultContact.full_name}`);
      contactService.setEditingContactId(null);
    } else {
      resultContact = await contactService.addContact(contactData);

      refreshContactListView();
      showNotification(`Contact added: ${resultContact.full_name}`);
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
    "Are you sure you want to delete this contact?",
  );
  if (!confirmDelete) return;

  try {
    await contactService.deleteContact(contactId);

    refreshContactListView();
    showNotification(`Contact deleted`);
  } catch (error) {
    showError();
    console.error("Failed to delete contact:", error);
  }
}

function handleEditContact(contact) {
  contactService.setEditingContactId(contact.id);
  fillForm(contact);
  setFormMode("edit");
  showForm();
}

function handleTagClick(tag) {
  const filtered = contactService.filterContactsByTag(tag);

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
  const contacts = contactService.getContacts();
  renderAllContacts(contacts, {
    onEdit: handleEditContact,
    onDelete: handleDeleteContact,
    onTagClick: handleTagClick,
  });
}
