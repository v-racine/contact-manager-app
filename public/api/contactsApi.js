const baseURL = "http://localhost:3000";

//GET fetch request for contacts
export const fetchData = async (path) => {
  const url = new URL(baseURL + path);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};

// Add createContact, updateContact, deleteContact, getContact
