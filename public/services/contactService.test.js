import { ContactService } from "./contactService.js";

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

describe("ContactService Behavioral Unit Tests", () => {
  let service;

  beforeEach(() => {
    service = new ContactService(MOCK_API);
    service.allContacts = [];
    jest.clearAllMocks();
  });

  test("should initialize with an empty contacts cache", () => {
    expect(service.getContacts()).toEqual([]);
    expect(service.getEditingContactId()).toBeNull();
  });

  test("preloadContacts should call API and populate the internal cache", async () => {
    // ARRANGE
    MOCK_API.getAllContacts.mockResolvedValue(SAMPLE_CONTACTS);

    // ACT
    await service.preloadContacts();

    // ASSERT
    expect(MOCK_API.getAllContacts).toHaveBeenCalledTimes(1);
    expect(service.getContacts()).toEqual(SAMPLE_CONTACTS);
  });

  test("preloadContacts should throw if the API call fails", async () => {
    // ARRANGE
    MOCK_API.getAllContacts.mockRejectedValue(new Error("Network Error"));

    // ACT & ASSERT
    await expect(service.preloadContacts()).rejects.toThrow("Network Error");
    expect(service.getContacts()).toEqual([]);
  });

  test("getContactDetail should call API with the correct ID and return data", async () => {
    // ARRANGE
    const contactId = 2;
    const apiResponse = SAMPLE_CONTACTS.find((c) => c.id === contactId);
    MOCK_API.getContact.mockResolvedValue(apiResponse);

    // ACT
    const result = await service.getContactDetail(contactId);

    // ASSERT
    expect(MOCK_API.getContact).toHaveBeenCalledWith(contactId);
    expect(result).toEqual(apiResponse);
  });

  test("getContactDetail should propagate error if the API call fails", async () => {
    // ARRANGE
    MOCK_API.getContact.mockRejectedValue(new Error("Contact Not Found"));

    // ACT & ASSERT
    await expect(service.getContactDetail(99)).rejects.toThrow(
      "Contact Not Found",
    );
  });

  describe("Filtering Logic (Testing Pure Functions on State)", () => {
    beforeEach(() => {
      service.allContacts = [...SAMPLE_CONTACTS];
    });

    test("filterContactsByQuery should return contacts matching query (case-insensitive)", () => {
      const results = service.filterContactsByQuery("sMitH");
      expect(results).toHaveLength(2);
    });

    test("filterContactsByTag should return all contacts tagged 'work'", () => {
      const results = service.filterContactsByTag("work");
      expect(results).toHaveLength(2);
      expect(results.some((c) => c.full_name === "Alice Smith")).toBe(true);
    });

    test("filterContactsByTag should return contacts with multiple tags", () => {
      const results = service.filterContactsByTag("friend");
      expect(results).toHaveLength(2);
      expect(results.some((c) => c.full_name === "Bob Johnson")).toBe(true);
    });

    test("filterContactsByTag should return results for tag regardless of case or whitespace", () => {
      // ARRANGE
      service.allContacts.push({
        id: 5,
        full_name: "Test Case",
        email: "test@case.com",
        tags: "  PrOjEcT, work ",
      });

      // ACT
      const results = service.filterContactsByTag("ProJEcT");

      // ASSERT
      expect(results).toHaveLength(1);
      expect(results[0].full_name).toBe("Test Case");

      // ACT 2
      const existingTagResults = service.filterContactsByTag("WOrK");

      // ASSERT 2
      expect(existingTagResults).toHaveLength(3);
    });
  });

  test("addContact should call API and correctly update the internal cache", async () => {
    // ARRANGE
    service.allContacts = [...SAMPLE_CONTACTS];
    const newContactData = { full_name: "New User", email: "new@test.com" };
    const apiResponse = { id: 5, ...newContactData };
    MOCK_API.createContact.mockResolvedValue(apiResponse);

    // ACT
    await service.addContact(newContactData);

    // ASSERT
    expect(MOCK_API.createContact).toHaveBeenCalledTimes(1);
    expect(service.getContacts()).toHaveLength(5);
    expect(service.getContacts()).toContainEqual(apiResponse);
  });

  test("updateContact should call API and replace contact in cache by ID", async () => {
    // ARRANGE
    service.allContacts = [...SAMPLE_CONTACTS];
    service.setEditingContactId(2);

    const updatedData = {
      full_name: "Robert Johnson",
      email: "robert@work.com",
    };
    const apiResponse = {
      id: 2,
      full_name: "Robert Johnson",
      email: "robert@work.com",
      tags: "friend",
    };
    MOCK_API.updateContact.mockResolvedValue(apiResponse);

    // ACT
    await service.updateContact(updatedData);

    // ASSERT
    const updatedContact = service.getContacts().find((c) => c.id === 2);
    expect(updatedContact.full_name).toBe("Robert Johnson");
    expect(service.getContacts()).toHaveLength(4);
  });

  test("updateContact should throw error if no editing ID is set", async () => {
    // ACT & ASSERT
    await expect(service.updateContact({})).rejects.toThrow(
      "Cannot update contact: no ID set for editing.",
    );
    expect(MOCK_API.updateContact).not.toHaveBeenCalled();
  });

  test("updateContact should reload cache if contact is not found locally", async () => {
    // ARRANGE
    service.allContacts = [...SAMPLE_CONTACTS];
    service.setEditingContactId(5);
    const updatedData = { full_name: "Updated Name" };
    const apiResponse = { id: 5, ...updatedData };
    MOCK_API.updateContact.mockResolvedValue(apiResponse);
    MOCK_API.getAllContacts.mockResolvedValue([
      ...SAMPLE_CONTACTS,
      apiResponse,
    ]);

    // ACT
    await service.updateContact(updatedData);

    // ASSERT
    expect(MOCK_API.updateContact).toHaveBeenCalledWith(5, updatedData);
    expect(MOCK_API.getAllContacts).toHaveBeenCalledTimes(1);
    expect(service.getContacts()).toContainEqual(apiResponse);
  });

  test("deleteContact should call API and remove contact from the cache", async () => {
    // ARRANGE
    service.allContacts = [...SAMPLE_CONTACTS];
    MOCK_API.deleteContact.mockResolvedValue(undefined);

    // ACT
    await service.deleteContact(3);

    // ASSERT
    expect(MOCK_API.deleteContact).toHaveBeenCalledWith(3);
    expect(service.getContacts()).toHaveLength(3);
    expect(service.getContacts().map((c) => c.id)).not.toContain(3);
  });
});
