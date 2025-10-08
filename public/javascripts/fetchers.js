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
const updateData = async (path, data) => {
  const url = new URL(baseURL + path);

  const submission = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: data, // The updated data for the resource
  });

  if (submission.ok && submission.status === 201) {
    const responseData = await submission.json();
    console.log(
      `This resource was successfully updated: ${JSON.stringify(responseData)}`
    );
    return responseData;
  } else {
    throw new Error(`HTTP request error: ${submission.status}`);
  }
};

//DELETE fetch request to delete an existing contact
const deleteData = async (path) => {
  const url = new URL(baseURL + path);

  const submission = await fetch(url, {
    method: "DELETE",
  });

  if (submission.ok) {
    if (submission.status === 204) {
      console.log("This resource was successfully deleted.");
    } else {
      // Handle cases where the API might return data on deletion (e.g., a confirmation message)
      const responseData = await submission.json();
      console.log(
        `Resource deleted. Server response: ${JSON.stringify(responseData)}`
      );
    }
    return; // Indicate successful deletion
  } else {
    throw new Error(`HTTP request error: ${submission.status}`);
  }
};
