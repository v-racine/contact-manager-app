export async function getAllContacts() {
  const res = await fetch("api/contacts");
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return res.json();
}

export async function getContact(id) {
  const res = await fetch(`api/contacts/${id}`);
  if (!res.ok) throw new Error("Contact not found");
  return res.json();
}
