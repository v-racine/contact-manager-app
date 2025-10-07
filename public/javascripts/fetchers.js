const baseURL = "http://localhost:3000";
const GENERIC_ERROR_MESSAGE =
  "Sorry, something went wrong. Please try again later.";

//GET fetch request for contacts
const fetchData = async (path) => {
  try {
    const url = new URL(baseURL + path);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    message.textContent = "";
    const data = await response.json();
    return data;
  } catch (error) {
    message.textContent = GENERIC_ERROR_MESSAGE;
    console.error("Could not fetch data:", error);
    return null;
  }
};

//POST fetch request to add a contact
const postNewData = async (path, data) => {
  try {
    const url = new URL(baseURL + path);
    const submission = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: data,
    });

    if (submission.status === 201) {
      message.textContent = "";
      const responseData = await submission.json();
      console.log(
        `This contact was sucessfully added: ${JSON.stringify(responseData)}`
      );
      return responseData;
    } else {
      throw new Error(`HTTP request error: ${submission.status}`);
    }
  } catch (err) {
    message.textContent = GENERIC_ERROR_MESSAGE;
    console.error("Could not send data:", err);
    return null;
  }
};

//PUT fetch request to edit existing contact
