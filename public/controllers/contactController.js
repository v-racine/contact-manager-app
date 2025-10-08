import { fetchData } from "../api/contactsApi.js";
import { renderAllContacts } from "../views/contactListView.js";

const message = document.querySelector("#message-for-user");
const GENERIC_ERROR_MESSAGE =
  "Sorry, something went wrong. Please try again later.";

export function initController() {
  const allContactsBtn = document.querySelector("#all-contacts");

  allContactsBtn.addEventListener("click", async () => {
    try {
      const contacts = await fetchData("/api/contacts");
      renderAllContacts(contacts);
    } catch (err) {
      console.error("Error loading contacts:", err);
      message.textContent = GENERIC_ERROR_MESSAGE;
    }
  });
}
