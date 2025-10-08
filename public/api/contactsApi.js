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
