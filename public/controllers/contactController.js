import { fetchData } from "../api/contactsApi.js";
import { renderAllContacts } from "../views/contactListView.js";

export function initController() {
  const message = document.querySelector("#message-for-user");
  const allContactsBtn = document.querySelector("#all-contacts");

  allContactsBtn.addEventListener("click", async () => {
    try {
      const contacts = await fetchData("/api/contacts");
      renderAllContacts(contacts);
    } catch (err) {
      console.error("Error loading contacts:", err);
      message.textContent =
        "Sorry, something went wrong. Please try again later.";
    }
  });
}
