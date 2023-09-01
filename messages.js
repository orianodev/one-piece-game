"use strict";
// DOM manipulation : inputs
const messageInput = document.querySelector("form input[name='message']");
// DOM manipulation : submit button
const buttonInput = document.querySelector("form input[name='button']");
// DOM manipulation : list to display messages
const messageListElement = document.querySelector("#messages-list");
// Fetch messages from Node/MongoDB backend server
const fetchMessages = () => {
  fetch("http://localhost:3000/api/messages")
    .then((response) => response.json())
    .then((data) => {
      displayMessages(data);
      console.log(data);
    }); // Call displayMessages function with data from GET messages API
};
// Display the fetched messages from GET API
const displayMessages = (messages) => {
  messages.forEach((message) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${message.content}`;
    messageListElement.appendChild(listItem);
  });
};
fetchMessages();

// Send form data (message infos) to Node/MongoDB backend server
const sendFormData = () => {
  const newMessage = {
    content: messageInput.value,
  };
  console.log(newMessage);
  fetch("http://localhost:3000/api/messages", {
    method: "POST",
    // headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(newMessage),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert("Ton message a bien été envoyé !");
      location.reload();
    });
};

// Trigger POST request to send form data
buttonInput.onclick = () => {
  if (messageInput.value !== "") sendFormData();
  else alert("Make sure to fill all the input fields.");
};
