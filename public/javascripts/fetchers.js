const baseURL = "http://localhost:3000";

//GET fetch request for contacts
const fetchData = async (path) => {
  const url = new URL(baseURL + path);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};

//POST fetch request to add a contact
const postNewData = async (path, data) => {
  const url = new URL(baseURL + path);
  const submission = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: data,
  });

  if (submission.status === 201) {
    const responseData = await submission.json();
    console.log(
      `This contact was sucessfully added: ${JSON.stringify(responseData)}`
    );
    return responseData;
  } else {
    throw new Error(`HTTP request error: ${submission.status}`);
  }
};

//PUT fetch request to edit existing contact
const editContactData = async (path, data) => {
  //STUB
};
