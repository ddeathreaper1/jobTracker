

function handleFormSubmit(event){
    event.preventDefault() 

    const form = document.getElementById("signupForm")
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phno").value
    const password = document.getElementById("pass").value

    const userDetails = {
        name:name,
        email:email,
        phone:phone,
        password:password
    }

    axios.post(`http://localhost:3000/user/addUser`,userDetails).then((res)=>{
        alert("User added successfully")
        window.location.href = "./login.html"
    }).catch((err)=>{
        console.log(err)
    })

    form.reset()
}