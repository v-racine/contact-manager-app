document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const fields = form.querySelectorAll("input");
  const formErrors = document.querySelector(".form_errors");
  const cancelBtn = document.querySelector("#cancel");

  const fullNameInput = document.getElementById("full_name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  function validateField(field) {
    const errorMessage = field.nextElementSibling;
    let isValid = true;

    if (field.validity.valid) {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
      field.classList.remove("invalid_field");
    } else {
      let message = field.validationMessage;

      if (field.validity.valueMissing) {
        message = `The ${field.name.replace("_", " ")} field is required.`;
      }

      errorMessage.textContent = message;
      errorMessage.style.display = "inline-block";
      field.classList.add("invalid_field");
      isValid = false;
    }
    return isValid;
  }

  fields.forEach((field, index) => {
    field.addEventListener("blur", () => {
      validateField(field);
    });

    field.addEventListener("focus", () => {
      const errorMessage = field.nextElementSibling;
      errorMessage.style.display = "none";
      formErrors.style.display = "none";
    });
  });

  fullNameInput.addEventListener("keydown", (e) => {
    const errorMessage = fullNameInput.nextElementSibling;
    const isValidChar = /[a-zA-Z'\s]/.test(e.key);

    if (!isValidChar) {
      e.preventDefault();
      errorMessage.textContent = "Please enter a letter.";
      errorMessage.style.display = "inline-block";
    } else {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    }
  });

  phoneInput.addEventListener("input", (e) => {
    const errorMessage = phoneInput.nextElementSibling;

    e.target.value = e.target.value.replace(/[^\d-]/g, "");
    const isValidInput = /^\d{3}-\d{3}-\d{4}$/.test(e.target.value);

    if (!isValidInput) {
      errorMessage.textContent =
        "Please enter a valid phone number (e.g., 111-222-3333).";
      errorMessage.style.display = "inline-block";
    } else {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (form.checkValidity()) {
      formErrors.style.display = "none";

      const inputData = {
        full_name: fullNameInput.value,
        email: emailInput.value,
        phone_number: phoneInput.value,
      };
      let JSONdata = JSON.stringify(inputData);

      await postNewData("/api/contacts", JSONdata);

      alert("Form submitted successfully!");
      form.reset();
      form.style.display = "none";
    } else {
      formErrors.textContent =
        "Form cannot be submitted until errors are corrected.";
      formErrors.style.display = "block";
    }
  });

  cancelBtn.addEventListener("click", () => {
    form.reset();
    form.style.display = "none";
  });
});
