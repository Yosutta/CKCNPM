const retailer = [
  {
    username: "yuuta",
    password: "123",
  },
  {
    username: "tuan",
    password: "tuan",
  },
];

const loginForm = document.querySelector("#login");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.querySelector("#username").value;
  console.log(retailer[0]["username"]);
  for (let i = 0; i < retailer.length; i++) {
    if (username === retailer[i]["username"]) {
      const password = document.querySelector("#password").value;
      if (password === retailer[i]["password"]) {
        const container = document.querySelector("#text");
        container.innerHTML = "Welcome back";
      }
    }
  }
});
