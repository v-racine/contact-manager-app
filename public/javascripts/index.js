const allContactsUrl = "http://localhost:3000/api/contacts";

//fetch for all contacts
const fetchAllContacts = async () => {
  try {
    const url = new URL(allContactsUrl);
    // url.search = new URLSearchParams({
    //   ...params,
    // });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data); //temporary for dev
    return data;
  } catch (error) {
    console.error("Could not fetch data:", error);
    return null;
  }
};

const searchInputEle = document.querySelector("#search-input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const contacts = await fetchAllContacts();

  if (!contacts) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultsWrapper.innerHTML = "";

  const filteredContacts = contacts.filter((contact) => {
    return contact.full_name.toLowerCase().includes(searchTerm);
  });

  if (!filteredContacts.length || searchTerm) {
    dropdown.classList.remove("is-active");
  }

  dropdown.classList.add("is-active");

  for (let contact of filteredContacts) {
    const option = document.createElement("a");

    option.classList.add("dropdown-item");
    option.textContent = contact.full_name;

    // option.addEventListener("click", (e) => {
    //   dropdown.classList.remove("is-active");
    //   input.value = inputValue(item);
    //   onOptionSelect(item);
    // });

    resultsWrapper.appendChild(option);
  }
};

searchInputEle.addEventListener("input", debounce(onInput));

document.addEventListener("click", (e) => {
  if (!searchInputEle.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});
