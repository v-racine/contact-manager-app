import { ContactService } from "./contactService";

const SAMPLE_CONTACTS = [
  {
    id: 1,
    full_name: "Alice Smith",
    email: "alice@work.com",
    tags: "work, client",
  },
  { id: 2, full_name: "Bob Johnson", email: "bob@home.com", tags: "friend" },
  {
    id: 3,
    full_name: "Charlie Brown",
    email: "charlie@work.com",
    tags: "work",
  },
  {
    id: 4,
    full_name: "Dan Smith",
    email: "dan@friend.com",
    tags: "friend, old",
  },
];

const MOCK_API = {
  getAllContacts: jest.fn(),
  getContact: jest.fn(),
  createContact: jest.fn(),
  updateContact: jest.fn(),
  deleteContact: jest.fn(),
};

describe("ContactService Unit Tests", () => {
  let contactService;

  beforeEach(() => {
    contactService = new ContactService(MOCK_API);
    contactService.allContacts = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with empty allContacts array", () => {
      expect(contactService.getContacts()).toEqual([]);
    });

    it("should initialize with null editingContactId", () => {
      expect(contactService.getEditingContactId()).toBeNull();
    });

    it("should store the api reference", () => {
      expect(contactService.api).toBe(MOCK_API);
    });
  });

  describe("getContacts", () => {
    it("should return the allContacts array", () => {
      contactService.allContacts = SAMPLE_CONTACTS;
      expect(contactService.getContacts()).toEqual(SAMPLE_CONTACTS);
    });
  });

  describe("getEditingContactId", () => {
    it("should return the current editing contact ID", () => {
      contactService.editingContactId = 42;
      expect(contactService.getEditingContactId()).toBe(42);
    });
  });

  describe("setEditingContactId", () => {
    it("should set the editing contact ID", () => {
      contactService.setEditingContactId(99);
      expect(contactService.editingContactId).toBe(99);
    });

    it("should allow setting to null", () => {
      contactService.setEditingContactId(42);
      contactService.setEditingContactId(null);
      expect(contactService.editingContactId).toBeNull();
    });
  });

  describe("filterContactsByQuery", () => {
    beforeEach(() => {
      contactService.allContacts = SAMPLE_CONTACTS;
    });

    it("should return empty array when query is empty string", () => {
      expect(contactService.filterContactsByQuery("")).toEqual([]);
    });

    it("should return empty array when query is null", () => {
      expect(contactService.filterContactsByQuery(null)).toEqual([]);
    });

    it("should return empty array when query is undefined", () => {
      expect(contactService.filterContactsByQuery(undefined)).toEqual([]);
    });

    it("should filter contacts by name (case insensitive)", () => {
      const results = contactService.filterContactsByQuery("john");
      expect(results).toHaveLength(1);
      expect(results).toEqual([
        {
          id: 2,
          full_name: "Bob Johnson",
          email: "bob@home.com",
          tags: "friend",
        },
      ]);
    });

    it("should handle uppercase queries", () => {
      const results = contactService.filterContactsByQuery("ALICE");
      expect(results).toHaveLength(1);
      expect(results[0].full_name).toBe("Alice Smith");
    });

    it("should handle partial name matches", () => {
      const results = contactService.filterContactsByQuery("o");
      expect(results).toHaveLength(2);
    });

    it("should return empty array when no matches found", () => {
      const results = contactService.filterContactsByQuery("xyz");
      expect(results).toEqual([]);
    });
  });

  describe("filterContactsByTag", () => {
    beforeEach(() => {
      contactService.allContacts = SAMPLE_CONTACTS;
    });

    it("should filter contacts by tag (case insensitive)", () => {
      const results = contactService.filterContactsByTag("work");
      expect(results).toHaveLength(2);
      expect(results.map((c) => c.id)).toEqual([1, 3]);
    });

    it("should handle uppercase tag queries", () => {
      const results = contactService.filterContactsByTag("WORK");
      expect(results).toHaveLength(2);
    });

    it("should handle tags with spaces", () => {
      const results = contactService.filterContactsByTag("old");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(4);
    });

    it("should return empty array for contacts without tags property", () => {
      const results = contactService.filterContactsByTag("work");
      expect(results.some((c) => c.id === 4)).toBe(false);
    });

    it("should return empty array for contacts with null tags", () => {
      const results = contactService.filterContactsByTag("anything");
      expect(results.some((c) => c.id === 4)).toBe(false);
    });

    it("should return empty array when tag not found", () => {
      const results = contactService.filterContactsByTag("nonexistent");
      expect(results).toEqual([]);
    });
  });

  //methods with api calls

  describe("preloadContacts", () => {
    it("should fetch contacts from API and store them", async () => {
      MOCK_API.getAllContacts.mockResolvedValue(SAMPLE_CONTACTS);

      const result = await contactService.preloadContacts();

      expect(MOCK_API.getAllContacts).toHaveBeenCalledTimes(1);
      expect(contactService.allContacts).toEqual(SAMPLE_CONTACTS);
      expect(result).toEqual(SAMPLE_CONTACTS);
    });

    it("should replace existing contacts", async () => {
      contactService.allContacts = [{ id: 99, full_name: "Old Contact" }];

      const newContacts = [{ id: 1, full_name: "New Contact" }];
      MOCK_API.getAllContacts.mockResolvedValue(newContacts);

      await contactService.preloadContacts();

      expect(contactService.allContacts).toEqual(newContacts);
      expect(contactService.allContacts).toHaveLength(1);
    });

    it("should handle API errors", async () => {
      MOCK_API.getAllContacts.mockRejectedValue(new Error("API Error"));

      await expect(contactService.preloadContacts()).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("getContactDetail", () => {
    it("should fetch contact details from API", async () => {
      MOCK_API.getContact.mockResolvedValue(SAMPLE_CONTACTS[0]);

      const result = await contactService.getContactDetail(1);

      expect(MOCK_API.getContact).toHaveBeenCalledWith(1);
      expect(result).toEqual(SAMPLE_CONTACTS[0]);
    });

    it("should handle API errors", async () => {
      MOCK_API.getContact.mockRejectedValue(new Error("Contact not found"));

      await expect(contactService.getContactDetail(999)).rejects.toThrow(
        "Contact not found",
      );
    });
  });

  describe("addContact", () => {
    it("should create contact via API and add to allContacts", async () => {
      const contactData = {
        full_name: "New Contact",
        email: "new@example.com",
      };
      const createdContact = { id: 1, ...contactData };
      MOCK_API.createContact.mockResolvedValue(createdContact);

      const result = await contactService.addContact(contactData);

      expect(MOCK_API.createContact).toHaveBeenCalledWith(contactData);
      expect(contactService.allContacts).toContainEqual(createdContact);
      expect(result).toEqual(createdContact);
    });

    it("should append to existing contacts", async () => {
      contactService.allContacts = [{ id: 1, full_name: "Existing" }];

      const newContact = { id: 2, full_name: "New" };
      MOCK_API.createContact.mockResolvedValue(newContact);

      await contactService.addContact({ full_name: "New" });

      expect(contactService.allContacts).toHaveLength(2);
      expect(contactService.allContacts[1]).toEqual(newContact);
    });

    it("should handle API errors", async () => {
      MOCK_API.createContact.mockRejectedValue(new Error("Creation failed"));

      await expect(contactService.addContact({})).rejects.toThrow(
        "Creation failed",
      );
    });
  });

  describe("updateContact", () => {
    beforeEach(() => {
      contactService.allContacts = SAMPLE_CONTACTS;
    });

    it("should throw error if no editing contact ID is set", async () => {
      contactService.editingContactId = null;

      await expect(
        contactService.updateContact({ full_name: "Updated" }),
      ).rejects.toThrow("Cannot update contact: no ID set for editing.");
    });

    it("should update contact via API and update in allContacts", async () => {
      contactService.editingContactId = 1;
      const updatedData = { full_name: "Alice Updated" };
      const updatedContact = { id: 1, ...updatedData };
      MOCK_API.updateContact.mockResolvedValue(updatedContact);

      const result = await contactService.updateContact(updatedData);

      expect(MOCK_API.updateContact).toHaveBeenCalledWith(1, updatedData);
      expect(contactService.allContacts[0]).toEqual(updatedContact);
      expect(result).toEqual(updatedContact);
    });

    it("should reload contacts if updated contact not found in local array", async () => {
      contactService.editingContactId = 99;
      const updatedContact = { id: 99, full_name: "New Contact" };
      const reloadedContacts = [
        { id: 1, full_name: "John Doe" },
        { id: 99, full_name: "New Contact" },
      ];

      MOCK_API.updateContact.mockResolvedValue(updatedContact);
      MOCK_API.getAllContacts.mockResolvedValue(reloadedContacts);

      const result = await contactService.updateContact({
        full_name: "New Contact",
      });

      expect(MOCK_API.updateContact).toHaveBeenCalledWith(99, {
        full_name: "New Contact",
      });
      expect(MOCK_API.getAllContacts).toHaveBeenCalled();
      expect(contactService.allContacts).toEqual(reloadedContacts);
      expect(result).toEqual(updatedContact);
    });

    it("should handle API errors", async () => {
      contactService.editingContactId = 1;
      MOCK_API.updateContact.mockRejectedValue(new Error("Update failed"));

      await expect(
        contactService.updateContact({ full_name: "Updated" }),
      ).rejects.toThrow("Update failed");
    });
  });

  describe("deleteContact", () => {
    beforeEach(() => {
      contactService.allContacts = SAMPLE_CONTACTS;
    });

    it("should delete contact via API and remove from allContacts", async () => {
      MOCK_API.deleteContact.mockResolvedValue();

      await contactService.deleteContact(2);

      expect(MOCK_API.deleteContact).toHaveBeenCalledWith(2);
      expect(contactService.allContacts).toHaveLength(3);
      expect(
        contactService.allContacts.find((c) => c.id === 2),
      ).toBeUndefined();
    });

    it("should only remove the specified contact", async () => {
      MOCK_API.deleteContact.mockResolvedValue();

      await contactService.deleteContact(1);

      expect(contactService.allContacts.map((c) => c.id)).toEqual([2, 3, 4]);
    });

    it("should handle deleting non-existent contact gracefully", async () => {
      MOCK_API.deleteContact.mockResolvedValue();

      await contactService.deleteContact(999);

      expect(contactService.allContacts).toHaveLength(4);
    });

    it("should handle API errors", async () => {
      MOCK_API.deleteContact.mockRejectedValue(new Error("Delete failed"));

      await expect(contactService.deleteContact(1)).rejects.toThrow(
        "Delete failed",
      );
    });
  });
});
