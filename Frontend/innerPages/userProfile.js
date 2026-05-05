
async function fillForm(){
    try {
        const token = localStorage.getItem("token")
        const response  = await axios.get("https://jobtracker-xhqr.onrender.com/user/getUser",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        // console.log(response)

        const name = response.data.name
        const email = response.data.email
        const phone = response.data.phoneno
        // console.log(name,email,phone)

        document.getElementById("name").value = name
        document.getElementById("email").value = email
        document.getElementById("phone").value = phone
    } catch (error) {
        console.log(error)
    }

}


function handleUserProfileUpdate(event){
    event.preventDefault()
    const token = localStorage.getItem("token")


    const updateData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    // pass: document.getElementById("pass").value
    }


    try {
        axios.put("https://jobtracker-xhqr.onrender.com/user/updateUser",updateData, {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        alert("Data updated")
        window.location.href = "../login.html"
    } catch (error) {
        console.log(error)
    }

}



function goBack(){
    window.location.href = "../index.html"
}



async function verify(){
    const token = localStorage.getItem("token")
    if (!token){
        alert("Unauthorized")
        console.log("No token found")
        window.location.href = "login.html"
        return
    }
    try {
        await axios.get(`https://jobtracker-xhqr.onrender.com/user/verifyUser`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("User verified")
        return true
    } catch (error) {
        console.log("User could not be verified")
        localStorage.removeItem("token")
        window.location.href = "login.html"
        return false
    }
}


async function verify(){
    const token = localStorage.getItem("token")
    if (!token){
        alert("Unauthorized")
        console.log("No token found")
        window.location.href = "login.html"
        return
    }
    try {
        await axios.get(`https://jobtracker-xhqr.onrender.com/user/verifyUser`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("User verified")
        return true
    } catch (error) {
        console.log("User could not be verified")
        localStorage.removeItem("token")
        window.location.href = "login.html"
        return false
    }
}

window.addEventListener("DOMContentLoaded",()=>{
    verify()
    fillForm()
})