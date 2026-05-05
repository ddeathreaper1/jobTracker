let allInterviews = []
let currPage = 1
const rowsPerPage = 10

async function loadInterviews(){
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get("https://jobtracker-xhqr.onrender.com/interviews/getInterviews",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        allInterviews = response.data
        renderTable()

    } catch (error) {
        console.log(error)
    }
}

function renderTable(data = allInterviews){
    const interviewTableBody = document.getElementById("interviewTableBody")
    interviewTableBody.innerHTML = ""

    const start = (currPage-1) * rowsPerPage
    const end = start + rowsPerPage
    const paginatedItems = data.slice(start,end)

    paginatedItems.forEach((interview, index)=>{
        const tr = document.createElement("tr")
        tr.innerHTML = `
        <td>${start + index + 1}</td>
        <td>${interview.companyName}</td>
        <td>${interview.interviewDate}</td>
        <td>${interview.post}</td>
        `;
        interviewTableBody.appendChild(tr)
    })
    renderPagination(data.length)
}


function renderPagination(totalItems = allInterviews.length){
    const paginationDiv = document.getElementById("pagination")
    const totalPages = Math.ceil(totalItems/rowsPerPage)
    paginationDiv.innerHTML = ""

    if (totalPages<=1) return

    for (let i = 1; i <= totalPages; i++){
        const span = document.createElement("span")
        span.innerText = i
        span.className = `page-link ${i === currPage ? 'active' : ''}`
        span.onclick = ()=>{
            currPage = i
            const searchItem = document.getElementById("searchInput").value.toLowerCase()

            const filteredInterviews = allInterviews.filter(interview=>{
                const companyName = (interview.companyName || "").toLowerCase()
                const role = (interview.post || "").toLowerCase()
                return companyName.includes(searchItem) || role.includes(searchItem)
                
            })
            renderTable(filteredInterviews)
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


function search(){
    document.getElementById("searchInput").addEventListener("input",()=>{
        const searchItem = document.getElementById("searchInput").value.toLowerCase()
        currPage = 1
        const filteredInterviews = allInterviews.filter(interview=>{
            const companyName = (interview.companyName || "").toLowerCase()
                const role = (interview.post || "").toLowerCase()
                return companyName.includes(searchItem) || role.includes(searchItem)
        })
        renderTable(filteredInterviews)
    })
}


async function navButtons(){
    const backBtn = document.getElementById("backBtn")
    const addBtn = document.getElementById("addBtn")
    const overlay = document.getElementById('interviewOverlay')
    const closeOverlay = document.getElementById("interviewcloseOverlay")
    const interviewForm = document.getElementById("interviewOverlayForm")


    backBtn.addEventListener("click",()=>{
        window.location.href = "../index.html"
    })


    addBtn.addEventListener("click",()=>{
            overlay.style.display = "flex"
    })
    closeOverlay.addEventListener("click",()=>{
        overlay.style.display = "none"
    })


    interviewForm.addEventListener("submit", async(event)=>{
        event.preventDefault()

        const companyName = document.getElementById("companyName").value
        const interviewDate = document.getElementById("interviewDate").value
        const role = document.getElementById("role").value

        const token = localStorage.getItem("token")

        const interview = {
            companyName:companyName,
            post:role,
            interviewDate:interviewDate
        }

        await axios.post("https://jobtracker-xhqr.onrender.com/interviews/addInterview", interview,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        })
        interviewForm.reset()
        overlay.style.display = "none"
        await loadInterviews()
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
    loadInterviews()
    search()
    navButtons()
})