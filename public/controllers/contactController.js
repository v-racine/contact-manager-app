import { fetchData } from "../api/contactsApi.js";
import { renderAllContacts } from "../views/contactListView.js";

export async function initController() {
  const message = document.querySelector("#message-for-user");

  try {
    const contacts = await fetchData("/api/contacts");
    renderAllContacts(contacts);
  } catch (err) {
    console.error("Error loading contacts:", err);
    message.textContent =
      "Sorry, something went wrong. Please try again later.";
  }
}
