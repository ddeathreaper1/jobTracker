let allCompanies = []
let currPage = 1
const rowsPerPage = 10

async function loadCompanies(){
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:3000/companies/getCompanies",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        allCompanies = response.data
        renderTable()

    } catch (error) {
        console.log(error)
    }
}

function renderTable(data = allCompanies){
    const companyTableBody = document.getElementById("companyTableBody")
    companyTableBody.innerHTML = ""

    const start = (currPage-1) * rowsPerPage
    const end = start + rowsPerPage
    const paginatedItems = data.slice(start,end)

    paginatedItems.forEach((company, index)=>{
        const tr = document.createElement("tr")
        tr.innerHTML = `
        <td>${start + index + 1}</td>
        <td>${company.companyName}</td>
        <td>${company.industry}</td>
        <td>${Number(company.companySize).toLocaleString()}</td>
        <td>${company.contactDetails || company.companyContact}</td>
        `;
        companyTableBody.appendChild(tr)
    })
    renderPagination(data.length)
}


function renderPagination(totalItems = allCompanies.length){
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

            const filteredCompanies = allCompanies.filter(company=>{
                const companyName = (company.companyName || "").toLowerCase()
                const industry = (company.industry || "").toLowerCase()
                return companyName.includes(searchItem) || industry.includes(searchItem)
                
            })
            renderTable(filteredCompanies)
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
        const filteredCompanies = allCompanies.filter(company=>{
            const companyName = (company.companyName || "").toLowerCase()
                const industry = (company.industry || "").toLowerCase()
                return companyName.includes(searchItem) || industry.includes(searchItem)
        })
        renderTable(filteredCompanies)
    })
}

async function navButtons(){
    const backBtn = document.getElementById("backBtn")
    const addBtn = document.getElementById("addBtn")
    const overlay = document.getElementById('companyOverlay')
    const closeOverlay = document.getElementById("companycloseOverlay")
    const companyForm = document.getElementById("companyOverlayForm")


    backBtn.addEventListener("click",()=>{
        window.location.href = "../index.html"
    })


    addBtn.addEventListener("click",()=>{
            overlay.style.display = "flex"
    })
    closeOverlay.addEventListener("click",()=>{
        overlay.style.display = "none"
    })


    companyForm.addEventListener("submit", async(event)=>{
        event.preventDefault()

        const companyName = document.getElementById("companyName").value
        const industry = document.getElementById("industry").value
        const companySize = document.getElementById("companySize").value
        const companyContact = document.getElementById("companyContact").value
        const token = localStorage.getItem("token")

        const company = {
            companyName:companyName,
            industry:industry,
            companySize:companySize,
            companyContact: companyContact
        }

        await axios.post("http://localhost:3000/companies/addCompany", company,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        })
        companyForm.reset()
        overlay.style.display = "none"
        await loadCompanies()
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
    loadCompanies()
    search()
    navButtons()
})