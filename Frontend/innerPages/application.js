let allApplications = []
let currPage = 1
const rowsPerPage = 10

document.getElementById("closeAppIntOverlay").addEventListener("click", () => {
    document.getElementById("app_int_overlay").style.display = "none"
    renderTable()
});

async function loadAppliedApplications(){
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get("https://jobtracker-xhqr.onrender.com/applications/getApplications",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        allApplications = response.data
        renderTable()

    } catch (error) {
        console.log(error)
    }
}

function renderTable(data = allApplications){
    const applicationTableBody = document.getElementById("applicationTableBody")
    applicationTableBody.innerHTML = ""

    const start = (currPage-1) * rowsPerPage
    const end = start + rowsPerPage
    const paginatedItems = data.slice(start,end)

    paginatedItems.forEach((application, index)=>{
        const tr = document.createElement("tr")
        tr.innerHTML = `
        <td>${start + index + 1}</td>
        <td>${application.companyName}</td>
        <td>${application.applyDate}</td>
        <td>${application.post}</td>
        <td>${application.note}</td>
        <td>${application.status}</td>
        <td>${application.attachments}</td>
        <td>
            <select class="status-select" onchange="updateStatus('${application.id}', this.value)">
                <option value="Applied" ${application.status === 'Applied' ? 'selected' : ''}>Applied</option>
                <option value="Online Assessment" ${application.status === 'Online Assessment' ? 'selected' : ''}>OA</option>
                <option value="Interviewing" ${application.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                <option value="Offered" ${application.status === 'Offered' ? 'selected' : ''}>Offered</option>
                <option value="Rejected" ${application.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
        </td>
        `;
        applicationTableBody.appendChild(tr)
    })
    renderPagination(data.length)
}


function search(){
    document.getElementById("searchInput").addEventListener("input",(e)=>{
        const searchItem = e.target.value.toLowerCase()

        const filteredApplications = allApplications.filter(app=>{
            return app.companyName.toLowerCase().includes(searchItem) ||
            app.post.toLowerCase().includes(searchItem) ||
            app.status.toLowerCase().includes(searchItem)
        })
        currPage = 1
        renderTable(filteredApplications)
    })
}

async function updateStatus(applicationId, newStatus){
    const token = localStorage.getItem("token")


    if (newStatus== "Interviewing"){
        const overlay = document.getElementById("app_int_overlay")
        overlay.style.display = "flex"
        overlay.dataset.appId = applicationId
    }else{
        await axios.put(`https://jobtracker-xhqr.onrender.com/applications/editApplication`,{
        applicationId:applicationId,
        status:newStatus
        },{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("Status updated successfully");
        loadAppliedApplications()
    }
}

async function getIntDate(event){
    event.preventDefault()

    const overlay = document.getElementById("app_int_overlay")
    const applicationId = overlay.dataset.appId
    const intDate = document.getElementById("intDate").value
    const token = localStorage.getItem("token")

    if(!intDate){
        alert("Interview date not selected")
        return
    }
    await axios.put(`https://jobtracker-xhqr.onrender.com/applications/editApplication`,{
        applicationId:applicationId,
        status:"Interviewing"
    },{
        headers:{
            "Authorization": `Bearer ${token}`
        }
    })

    await addToInterview(applicationId,intDate)
    overlay.style.display = "none"
    loadAppliedApplications()
}


async function addToInterview(applicationId, intDate){
    const token = localStorage.getItem("token")
    const response = await axios.get(`https://jobtracker-xhqr.onrender.com/applications/getApplication?applicationId=${applicationId}`,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
    })
    const application = response.data
    const interview = {
        companyName: application.companyName,
        post: application.post,
        interviewDate: intDate
    }
    await axios.post("https://jobtracker-xhqr.onrender.com/interviews/addInterview", interview,{
        headers:{
            "Authorization": `Bearer ${token}`
    }
    })
}


function renderPagination(totalItems = allApplications.length){
    const paginationDiv = document.getElementById("pagination")
    const totalPages = Math.ceil(totalItems.length/rowsPerPage)
    paginationDiv.innerHTML = ""

    if (totalPages<=1) return

    for (let i = 1; i <= totalPages; i++){
        const button = document.createElement("button")
        button.innerText = i
        button.className = `page-link ${i === currPage ? 'active' : ''}`
        button.onclick = ()=>{
            currPage = i
            const searchItem = document.getElementById("searchInput").value
            const filtered = allApplications.filter(app=>{
                return app.companyName.toLowerCase().includes(searchItem) ||
                app.post.toLowerCase().includes(searchItem) ||
                app.status.toLowerCase().includes(searchItem)
            })
            renderTable(filtered)
        }

        paginationDiv.appendChild(button)
        // if(i<totalPages){
        //     const dots = document.createElement("span")
        //     dots.innerText = " . . . "
        //     dots.className = "dots"
        //     paginationDiv.appendChild(dots)
        // }
    }
}





function applicationOverlay(){
    const backBtn = document.getElementById("backBtn")
    const addBtn = document.getElementById("addBtn")
    const overlay = document.getElementById('applicationOverlay')
    const closeOverlay = document.getElementById("applicationcloseOverlay")
    const applicationForm = document.getElementById("applicationOverlayForm")

    backBtn.addEventListener("click",()=>{
        window.location.href = "../index.html"
    })


    addBtn.addEventListener("click",()=>{
            overlay.style.display = "flex"
    })


    closeOverlay.addEventListener("click",()=>{
        overlay.style.display = "none"
    })


    applicationForm.addEventListener("submit", async(event)=>{
        event.preventDefault()
        const fileInput = document.getElementById("applicationAttachments")
        // console.log(fileInput)
        const file = fileInput.files[0]
        const formData = new FormData()
        formData.append("companyName", document.getElementById("companyName").value)
        formData.append("post", document.getElementById("applicationRole").value)
        formData.append("applyDate", document.getElementById("appliedDate").value)
        formData.append("note", document.getElementById("applicationNote").value)
        formData.append("status", document.getElementById("applicationStatus").value)
        if(file){
            formData.append("attachments", file)
        }
        const token = localStorage.getItem("token")


        await axios.post("https://jobtracker-xhqr.onrender.com/applications/addApplication", formData,{
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
        })
        document.getElementById("applicationRole").value = ""
        document.getElementById("companyName").value = ""
        document.getElementById("appliedDate").value = ""
        document.getElementById("applicationNote").value = ""
        document.getElementById("applicationStatus").value = ""
        document.getElementById("applicationAttachments").value = ""
        overlay.style.display = "none"
        await loadAppliedApplications()
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
    loadAppliedApplications()
    search()
    applicationOverlay()
})