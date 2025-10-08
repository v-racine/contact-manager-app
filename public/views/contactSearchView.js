let _onContactSelect = null; // private variable to store callback

export function initSearchView({ onSearchInput, onContactSelect }) {
  const input = document.getElementById("search-input");
  _onContactSelect = onContactSelect;

  input.addEventListener("input", () => {
    onSearchInput(input.value);
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
