import { debounce } from "../utils/domUtils.js";

let _onContactSelect = null; // private variable to store callback

export function initSearchView({ onSearchInput, onContactSelect }) {
  const input = document.getElementById("search-input");
  const dropdown = document.querySelector(".dropdown");

  _onContactSelect = onContactSelect;

  input.addEventListener(
    "input",
    debounce(() => {
      onSearchInput(input.value);
    }),
  );

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target)) {
      dropdown.classList.remove("is-active");
      input.value = "";
    }
  });
}

export function renderSearchResults(contacts) {
  const dropdown = document.querySelector(".dropdown");
  const resultsWrapper = document.querySelector(".results");

  resultsWrapper.innerHTML = "";

  if (!contacts.length) {
    dropdown.classList.remove("is-active");
  } else {
    dropdown.classList.add("is-active");
  }

  for (let contact of contacts) {
    const option = document.createElement("a");

    option.classList.add("dropdown-item");
    option.textContent = contact.full_name;

    //use the stored callback
    option.addEventListener("click", (e) => {
      dropdown.classList.remove("is-active");
      if (_onContactSelect) _onContactSelect(contact.id);
    });

    resultsWrapper.appendChild(option);
  }
}
