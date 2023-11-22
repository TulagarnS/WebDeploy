//login js
function login(){
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	let data = {
		username: username,
		password: password
	};

	fetch("http://localhost:3000/adminlogin", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
	.then(res => res.json())
	.then(data => {
		console.log(data)
		if(data.status == "success"){
			window.location.href = "./admin/admin.html";
			localStorage.setItem("token", data.token);
		}
		else{
			alert("Invalid username or password");
		}
	})
  }

  function authenadmin(){
	let token = localStorage.getItem("token");

	if(token == null){
		window.location.href = "../adminlogin.html";
	}
	else{
		fetch("http://localhost:3000/adminauthen", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({token: token})
		})
		.then(res => res.json())
		.then(data => {
			if(data.status == "success"){
				console.log("Authenticated");
			}
			else{
				window.location.href = "../adminlogin.html";
				localStorage.removeItem("token");
			}
		})
	}
  }
