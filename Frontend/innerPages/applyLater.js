let allApplyLaters = []
let currPage = 1
const rowsPerPage = 10

async function loadApplyLaters(){
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get("https://jobtracker-xhqr.onrender.com/applyLater/getApplyLaters",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        allApplyLaters = response.data
        renderTable()

    } catch (error) {
        console.log(error)
    }
}

async function renderTable(){
    const applyLaterTableBody = document.getElementById("applyLaterTableBody")
    applyLaterTableBody.innerHTML = ""

    const start = (currPage-1) * rowsPerPage
    const end = start + rowsPerPage
    const paginatedItems = allApplyLaters.slice(start,end)

    paginatedItems.forEach((applyLater, index)=>{
        const tr = document.createElement("tr")

        let statusContent = applyLater.applied ? "Yes" : "No"

        tr.innerHTML = `
                <td>${start + index + 1}</td>
                <td>${applyLater.companyName}</td>
                <td>${applyLater.applyLink}</td>
                <td id="status-cell-${applyLater.id}">${statusContent}</td>
            `;

        if(!applyLater.applied){
            const btn = document.createElement("button")
            btn.className = "AppliedBtn"
            btn.innerText = "Applied"
            btn.style.marginLeft = "10px"

            btn.addEventListener("click",async ()=>{
                const token = localStorage.getItem('token')
                await axios.put("https://jobtracker-xhqr.onrender.com/applyLater/editApplyLater",{
                    id:applyLater.id,
                    companyName:applyLater.companyName,
                    applyLink:applyLater.applyLink,
                    applied:true
                },{
                    headers:{
                        "Authorization": `Bearer ${token}`
                    }
                })
                await loadApplyLaters()
            })
            tr.querySelector(`#status-cell-${applyLater.id}`).appendChild(btn);
        }   
        applyLaterTableBody.appendChild(tr)
    })
    renderPagination()
}


function renderPagination(){
    const paginationDiv = document.getElementById("pagination")
    const totalPages = Math.ceil(allApplyLaters.length/rowsPerPage)
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
    const overlay = document.getElementById('applyLaterOverlay')
    const closeOverlay = document.getElementById("applyLatercloseOverlay")
    const applyLaterForm = document.getElementById("applyLaterOverlayForm")


    backBtn.addEventListener("click",()=>{
        window.location.href = "../index.html"
    })


    addBtn.addEventListener("click",()=>{
            overlay.style.display = "flex"
    })
    closeOverlay.addEventListener("click",()=>{
        overlay.style.display = "none"
    })


    applyLaterForm.addEventListener("submit", async(event)=>{
        event.preventDefault()

        const companyName = document.getElementById("companyName").value
        const applyLink = document.getElementById("applyLink").value
        const applied = document.querySelector('input[name="choice"]:checked').value === "true"
        const token = localStorage.getItem("token")

        const applyLater = {
            companyName:companyName,
            applyLink:applyLink,
            applied:applied
        }

        await axios.post("https://jobtracker-xhqr.onrender.com/applyLater/addApplyLater", applyLater,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        })
        applyLaterForm.reset()
        overlay.style.display = "none"
        await loadApplyLaters()
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
    loadApplyLaters()
    navButtons()
})