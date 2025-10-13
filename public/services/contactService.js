export class ContactService {
  constructor(contactsApi) {
    this.api = contactsApi;

    this.allContacts = [];
    this.editingContactId = null;
  }

  getContacts() {
    return this.allContacts;
  }

  getEditingContactId() {
    return this.editingContactId;
  }

  setEditingContactId(id) {
    this.editingContactId = id;
  }

  filterContactsByQuery(query) {
    if (!query) {
      return [];
    }

    const queryLower = query.toLowerCase();
    const results = this.allContacts.filter((contact) => {
      return contact.full_name.toLowerCase().includes(queryLower);
    });
    return results;
  }

  filterContactsByTag(tag) {
    const tagLower = tag.toLowerCase();

    const results = this.allContacts.filter((contact) => {
      if (!contact.tags) {
        return false;
      }
      const tagsArray = contact.tags
        .split(",")
        .map((t) => t.trim().toLowerCase());
      return tagsArray.includes(tagLower);
    });

    return results;
  }

  async preloadContacts() {
    const contacts = await this.api.getAllContacts();
    this.allContacts = contacts;
    return this.allContacts;
  }

  async getContactDetail(id) {
    return await this.api.getContact(id);
  }

  async addContact(contactData) {
    const newContact = await this.api.createContact(contactData);
    this.allContacts.push(newContact);
    return newContact;
  }

  async updateContact(contactData) {
    if (!this.editingContactId) {
      throw new Error("Cannot update contact: no ID set for editing.");
    }

    const updatedContact = await this.api.updateContact(
      this.editingContactId,
      contactData,
    );

    const index = this.allContacts.findIndex((contact) => {
      return contact.id === this.editingContactId;
    });

    if (index !== -1) {
      this.allContacts[index] = updatedContact;
    } else {
      await this.preloadContacts();
    }

    return updatedContact;
  }

  async deleteContact(contactId) {
    await this.api.deleteContact(contactId);

    this.allContacts = this.allContacts.filter((contact) => {
      return contact.id !== contactId;
    });
  }
}
