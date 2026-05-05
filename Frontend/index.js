
document.getElementById('profileIcon').addEventListener("click",()=>{
    window.location.href = "./innerPages/userProfile.html"
})




async function calendar(){
    const calendarGrid = document.getElementById('calendar-grid')
    const monthLabel = document.getElementById('month')

    const now = new Date()
    const currDate = now.getDate()
    const currMonth = now.getMonth()
    const currYear = now.getFullYear()

    const token = localStorage.getItem("token")

    try {
    const response = await axios.get("http://localhost:3000/interviews/getInterviews",{
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })

    const interviews = response.data

    const interviewDates = []

    // console.log(interviews[0].interviewDate)
    interviews.forEach(interview=>{
        const date = new Date(interview.interviewDate)
        if (date.getUTCFullYear() === currYear && date.getUTCMonth() === currMonth){
            interviewDates.push(date.getUTCDate())
        }
        
    })


    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const monthName = now.toLocaleString('default', { month: 'long' })

    monthLabel.innerText = `${monthName.toUpperCase()}`

    calendarGrid.innerHTML = ""

    dayLabels.forEach(day => {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'day-label';
        labelDiv.innerText = day;
        calendarGrid.appendChild(labelDiv);
    });

    const firstDayIndex = new Date(currYear, currMonth, 1).getDay();
    const lastDay = new Date(currYear, currMonth + 1, 0).getDate();


    for (let x = 0; x < firstDayIndex; x++) {
        const spacer = document.createElement('div');
        spacer.className = 'day empty';
        calendarGrid.appendChild(spacer);
    }

    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerText = i;
        if(i==currDate){
            dayDiv.classList.add('currDate')
        }
        if (interviewDates.includes(i)) {
            dayDiv.classList.add('highlight');
            dayDiv.title = "Interview Scheduled";
        }
    
        calendarGrid.appendChild(dayDiv);
    }
} catch (error) {
        console.log(error)
}
}



async function loadAppliedApplications(){
    const appliedList = document.getElementById("applied-list")
    appliedList.innerHTML = ""
    // const appliedCounter = document.getElementById("applied-count")
    const token = localStorage.getItem("token")

    try {
        const response = await axios.get("http://localhost:3000/applications/getApplications",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        const allApplications = response.data
        const applications = allApplications.slice(0,5)

        const btn = document.createElement("button")
        btn.setAttribute('id',"addApplication")
        btn.classList = "add-btn"
        btn.setAttribute("style","background-color: #6366f1; border: none; color: white; border-radius: 6px; padding: 5px 10px; cursor: pointer; margin-left:10px")
        btn.innerText = "Add +"
        const appliedCounter = document.createElement("div")
        appliedCounter.classList.add("stat-header")
        appliedCounter.setAttribute("id","applied-count")
        appliedCounter.innerText = `APPLIED ${allApplications.length}`
        appliedCounter.appendChild(btn)
        appliedList.appendChild(appliedCounter)


        applications.forEach(application=>{
            const statItem = document.createElement('div')
            statItem.className = 'stat-item'

            const date = new Date(application.applyDate)
            const formattedDate = `${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`
            statItem.innerHTML = `
            <h2>${application.companyName}</h2> <br>
            <p>${application.post}</p> <br>
            <p>${formattedDate}</p>
            <p>${application.status}</p>
            `

            appliedList.appendChild(statItem)
        })

    } catch (error) {
        console.log(error)
    }
}


function applicationOverlay(){
    const overlay = document.getElementById('applicationOverlay')
    const addApplicationBtn = document.getElementById("addApplication")
    const closeOverlay = document.getElementById("applicationcloseOverlay")
    const applicationForm = document.getElementById("applicationOverlayForm")

    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "addApplication") {
            overlay.style.display = "flex";
    }
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


        await axios.post("http://localhost:3000/applications/addApplication", formData,{
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



async function loadInterviews(){
    const interviewList = document.getElementById("interviews-list")
    interviewList.innerHTML = ""
    const token = localStorage.getItem("token")

    try {
        const response = await axios.get("http://localhost:3000/interviews/getInterviews",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        const allInterviews = response.data
        const interviews = allInterviews.slice(0,5)

        const btn = document.createElement("button")
        btn.setAttribute('id',"addInterview")
        btn.classList = "add-btn"
        btn.setAttribute("style","background-color: #6366f1; border: none; color: white; border-radius: 6px; padding: 5px 10px; cursor: pointer; margin-left:10px")
        btn.innerText = "Add +"
        const interviewsCount = document.createElement("div")
        interviewsCount.classList.add("stat-header")
        interviewsCount.setAttribute("id","interviews-count")
        interviewsCount.innerText = `Interviews ${allInterviews.length}`
        interviewsCount.appendChild(btn)
        interviewList.appendChild(interviewsCount)


        interviews.forEach(interview=>{
            const statItem = document.createElement('div')
            statItem.className = 'stat-item'

            const date = new Date(interview.interviewDate)
            const formattedDate = `${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`
            statItem.innerHTML = `
            <h2>${interview.companyName}</h2> <br>
            <p>${interview.post}</p> <br>
            <p>${formattedDate}</p>
            `

            interviewList.appendChild(statItem)
        })
        await calendar()

    } catch (error) {
        console.log(error)
    }
}



function interviewOverlay(){
    const overlay = document.getElementById('interviewOverlay')
    const addInterviewBtn = document.getElementById("addInterview")
    const closeOverlay = document.getElementById("interviewcloseOverlay")
    const interviewForm = document.getElementById("interviewOverlayForm")

    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "addInterview") {
            overlay.style.display = "flex";
    }
    })
    closeOverlay.addEventListener("click",()=>{
        overlay.style.display = "none"
    })


    interviewForm.addEventListener("submit", async(event)=>{
        event.preventDefault()

        const companyName = document.getElementById("interviewCompanyName").value
        const post = document.getElementById("interviewRole").value
        const interviewDate = document.getElementById("interviewDate").value
        const token = localStorage.getItem("token")

        const interview = {
            companyName:companyName,
            post:post,
            interviewDate:interviewDate
        }

        await axios.post("http://localhost:3000/interviews/addInterview", interview,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        })
        document.getElementById("interviewRole").value = ""
        document.getElementById("interviewCompanyName").value = ""
        document.getElementById("interviewDate").value = ""
        overlay.style.display = "none"
        await loadInterviews()
    })
}


async function loadOffers(){
    const offersList = document.getElementById("offers-list")
    offersList.innerHTML = ""
    const token = localStorage.getItem("token")

    try {
        const response = await axios.get("http://localhost:3000/offers/getOffers",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })

        const allOffers = response.data
        const offers = allOffers.slice(0,5)

        const btn = document.createElement("button")
        btn.setAttribute('id',"addOffer")
        btn.classList = "add-btn"
        btn.setAttribute("style","background-color: #6366f1; border: none; color: white; border-radius: 6px; padding: 5px 10px; cursor: pointer; margin-left:10px")
        btn.innerText = "Add +"
        const offersCount = document.createElement("div")
        offersCount.classList.add("stat-header")
        offersCount.setAttribute("id","offers-count")
        offersCount.innerText = `Offers ${allOffers.length}`
        offersCount.appendChild(btn)
        offersList.appendChild(offersCount)


        offers.forEach(offer=>{
            const statItem = document.createElement('div')
            statItem.className = 'stat-item'

            const date = new Date(offer.lastDate)
            const formattedDate = `${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`
            statItem.innerHTML = `
            <h2>${offer.companyName}</h2> <br>
            <p>${offer.post}</p> <br>
            <p>${formattedDate}</p>
            `

            offersList.appendChild(statItem)
        })

    } catch (error) {
        console.log(error)
    }
}


function offerOverlay(){
    const overlay = document.getElementById('offerOverlay')
    const addOfferBtn = document.getElementById("addOffer")
    const closeOverlay = document.getElementById("offercloseOverlay")
    const offerForm = document.getElementById("offerOverlayForm")

    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "addOffer") {
            overlay.style.display = "flex";
    }
    })
    closeOverlay.addEventListener("click",()=>{
        overlay.style.display = "none"
    })


    offerForm.addEventListener("submit", async(event)=>{
        event.preventDefault()

        const companyName = document.getElementById("offerCompanyName").value
        const post = document.getElementById("offerRole").value
        const offerDate = document.getElementById("offerDate").value
        const token = localStorage.getItem("token")

        const offer = {
            companyName:companyName,
            post:post,
            lastDate:offerDate
        }

        await axios.post("http://localhost:3000/offers/addOffer", offer,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        })
        document.getElementById("offerRole").value = ""
        document.getElementById("offerCompanyName").value = ""
        document.getElementById("offerDate").value = ""
        overlay.style.display = "none"
        await loadOffers()
    })
}



async function loadQuickInsights(){
    const token = localStorage.getItem("token")

    try {
        const apps = await axios.get("http://localhost:3000/applications/getApplications", {headers:{"Authorization":`Bearer ${token}`}})
        const interviews = await axios.get("http://localhost:3000/interviews/getInterviews", {headers:{"Authorization":`Bearer ${token}`}})
        const offers = await axios.get("http://localhost:3000/offers/getOffers", {headers:{"Authorization":`Bearer ${token}`}})

        const totalApps = apps.data.length
        const totalInterviews = interviews.data.length
        const totalOffers = offers.data.length
        let interviewPercentage = "0%"
        let offerPercentage = "0%"
        if (totalApps>0){
            interviewPercentage = ((totalInterviews/totalApps)*100).toFixed(2) + "%"
            offerPercentage = ((totalOffers/totalApps)*100).toFixed(2) + "%"
        }
        document.getElementById("QI-Applications").querySelector("span").innerText = `Applications: ${totalApps}`
        document.getElementById("QI-Interviews").querySelector("span").innerText = `Interviews: ${interviewPercentage}`
        document.getElementById("QI-Offers").querySelector("span").innerText = `Offers: ${offerPercentage}`


    } catch (error) {
        console.log(error)
    }
}





async function loadToDo(){
    const token = localStorage.getItem("token")

    const response = await axios.get("http://localhost:3000/notes/getNotes",{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })

    const notes = response.data.filter(note=>note.completed === false).slice(0,5)
    const ul = document.getElementById("todo-list")
    ul.innerHTML = ""

    notes.forEach(note=>{
        // console.log(note)
            const li = document.createElement("li")
            li.className = "todo-item"
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.addEventListener("click",async ()=>{
                const updatedNote = {
                    noteId: note.id,
                    completed: true,
                    content: note.content
                }
                const res = await axios.put("http://localhost:3000/notes/editNote",updatedNote,{
                    headers:{
                        "Authorization": `Bearer ${token}`
                    }
                })
                console.log(res.data)
                loadToDo()
            })
            checkbox.id = `${note.id}`

            const label = document.createElement("label")
            label.htmlFor = `${note.id}`
            label.appendChild(document.createTextNode(`${note.content}`))

            li.appendChild(checkbox)
            li.appendChild(label)
            ul.appendChild(li)
    })
}





// async function toDoAddForm(){
//     try {
//         const content = document.getElementById("noteContent").value
//         const token = localStorage.getItem("token")
    
//         const note = {
//             content:content,
//             completed:false
//         }
    
//         await axios.post("http://localhost:3000/notes/addNote", note,{
//         headers:{
//             "Authorization": `Bearer ${token}`
//         }
//         })
//         await loadToDo()
//     } catch (error) {
//      console.log(error)   
//     }
// }


function noteOverlay(){
    const overlay = document.getElementById('noteOverlay')
    const addNoteBtn = document.getElementById("addNote")
    const closeOverlay = document.getElementById("notecloseOverlay")
    const noteForm = document.getElementById("noteOverlayForm")

    addNoteBtn.addEventListener("click",()=>{
        overlay.style.display = "flex"
    })
    closeOverlay.addEventListener("click",()=>{
        overlay.style.display = "none"
    })


    noteForm.addEventListener("submit", async(event)=>{
        event.preventDefault()

        const content = document.getElementById("noteContent").value
        const token = localStorage.getItem("token")

        const note = {
            content:content,
            completed:false
        }

        await axios.post("http://localhost:3000/notes/addNote", note,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        })
        document.getElementById("noteContent").value = ""
        overlay.style.display = "none"
        await loadToDo()
    })
}


async function overlay(){
    await noteOverlay()
    await applicationOverlay()
    await interviewOverlay()
    await offerOverlay()
    await loadQuickInsights()
}



function redirect(){
    document.getElementById("gotoApplicationBtn").addEventListener("click",()=>{
        window.location.href = "./innerpages/application.html"
    })
    document.getElementById("gotoInterviewBtn").addEventListener("click",()=>{
        window.location.href = "./innerpages/interview.html"
    })
    document.getElementById("gotoOfferBtn").addEventListener('click',()=>{
        window.location.href = "./innerpages/offer.html"
    })
    document.getElementById("gotoCompaniesBtn").addEventListener("click",()=>{
        window.location.href = "./innerpages/companies.html"
    })
    document.getElementById("gotoApplylaterBtn").addEventListener("click",()=>{
        window.location.href = "./innerpages/applyLater.html"
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

window.addEventListener("DOMContentLoaded", ()=>{
    verify()
    calendar()
    loadAppliedApplications()
    loadInterviews()
    loadOffers()
    loadQuickInsights()
    loadToDo()
    overlay()
    redirect()
})