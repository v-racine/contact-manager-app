export async function getAllContacts() {
  const res = await fetch("api/contacts");
  if (!res.ok) {
    throw new Error(`Failed to fetch contacts. Status: ${res.status}`);
  }
  return res.json();
}

export async function getContact(id) {
  const res = await fetch(`api/contacts/${id}`);
  if (!res.ok) {
    if (!res.ok)
      throw new Error(
        `Failed to fetch contact with ID ${id}. Status: ${res.status}`
      );
  }
  return res.json();
}

export async function createContact(contactData) {
  const res = await fetch("api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(contactData),
  });

  if (!res.ok) {
    throw new Error(`Failed to create contact: ${res.status}`);
  }

  return await res.json();
}

export async function deleteContact(contactId) {
  const res = await fetch(`api/contacts/${contactId} poop`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete contact ${contactId}`);
  }
}
