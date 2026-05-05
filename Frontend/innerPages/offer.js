let allOffers = []
let currPage = 1
const rowsPerPage = 10

async function loadOffers(){
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:3000/offers/getOffers",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        allOffers = response.data
        renderTable()

    } catch (error) {
        console.log(error)
    }
}

function renderTable(){
    const offerTableBody = document.getElementById("offerTableBody")
    offerTableBody.innerHTML = ""

    const start = (currPage-1) * rowsPerPage
    const end = start + rowsPerPage
    const paginatedItems = allOffers.slice(start,end)

    paginatedItems.forEach((offer, index)=>{
        const tr = document.createElement("tr")
        tr.innerHTML = `
        <td>${start + index + 1}</td>
        <td>${offer.companyName}</td>
        <td>${offer.lastDate}</td>
        <td>${offer.post}</td>
        `;
        offerTableBody.appendChild(tr)
    })
    renderPagination()
}


function renderPagination(){
    const paginationDiv = document.getElementById("pagination")
    const totalPages = Math.ceil(allOffers.length/rowsPerPage)
    paginationDiv.innerHTML = ""

    if (totalPages<=1) return

    for (let i = 1; i <= totalPages; i++){
        const span = document.createElement("span")
        span.innerText = i
        span.className = `page-link ${i === currPage ? 'active' : ''}`
        span.onclick = ()=>{
            currPage = i
            renderTable()
        }

        paginationDiv.appendChild(span)
        if(i<totalPages){
            const dots = document.createElement("span")
            dots.innerText = " . . . "
            dots.className = "dots"
            paginationDiv.appendChild(dots)
        }
    }
}


async function navButtons(){
    const backBtn = document.getElementById("backBtn")
    const addBtn = document.getElementById("addBtn")
    const overlay = document.getElementById('offerOverlay')
    const closeOverlay = document.getElementById("offercloseOverlay")
    const offerForm = document.getElementById("offerOverlayForm")


    backBtn.addEventListener("click",()=>{
        window.location.href = "../index.html"
    })


    addBtn.addEventListener("click",()=>{
            overlay.style.display = "flex"
    })
    closeOverlay.addEventListener("click",()=>{
        overlay.style.display = "none"
    })


    offerForm.addEventListener("submit", async(event)=>{
        event.preventDefault()

        const companyName = document.getElementById("companyName").value
        const lastDate = document.getElementById("lastDate").value
        const role = document.getElementById("role").value

        const token = localStorage.getItem("token")

        const offer = {
            companyName:companyName,
            post:role,
            lastDate:lastDate
        }

        await axios.post("http://localhost:3000/offers/addOffer", offer,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        })
        offerForm.reset()
        overlay.style.display = "none"
        await loadOffers()
    })
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
        await axios.get(`http://localhost:3000/user/verifyUser`,{
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
    loadOffers()
    navButtons()
})