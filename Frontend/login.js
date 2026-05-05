const api_url = "https://jobtracker-xhqr.onrender.com/user"

function handleFormSubmit(event){
    event.preventDefault()

    const loginDetails = {
        identifier: document.getElementById("identifier").value,
        password: document.getElementById("password").value
    }


    axios.post(`${api_url}/validate`,loginDetails).then((result)=>{
        alert("Logged in successfully")
        localStorage.setItem('token', result.data.token)
        localStorage.setItem("userId",result.data.id)
        localStorage.setItem("phone", result.data.phone)
        console.log(result.data.token)
        window.location.href = "./index.html"

    }).catch((error)=>{
        if(error.response){
            alert(error.response.data.message)
        }else{
            alert("Server side error")
        }
    })
}

window.addEventListener("DOMContentLoaded",()=>{
    localStorage.clear()
})