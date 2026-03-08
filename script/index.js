const createElement = (arr) => {
  const htmlElements = arr.map(
    (el) => `<span class="badge badge-soft badge-error ">${el}</span>`,
  );
  return htmlElements.join(" ");
};

const loadSpinner = (status) => {
  if (status == true) {
    document.getElementById("loading-spinner").classList.remove("hidden");
    document.getElementById("issue-container").classList.add("hidden");
  } else {
    document.getElementById("loading-spinner").classList.add("hidden");
    document.getElementById("issue-container").classList.remove("hidden");
  }
};

const loadModal = async (id) =>{
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`

  const res = await fetch(url);
  const data = await res.json();
  displayModal(data.data)
}


const displayModal = (issue) =>{
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = `
    <div class="space-y-6"> 
                    <h2 class="font-bold text-2xl">${issue.title}</h2>
                    <div class="gap-5">
                        <span class="badge badge-success text-white">${issue.status}</span>
                        <span class="text-xs text-gray-400">•  Opened by ${issue.author}  •</span>
                        <span class="text-xs text-gray-400">${issue.createdAt}</span>
                    </div>
                    <div class="flex flex-wrap gap-2 text-[10px]">
                            ${createElement(issue.labels)}
                        </div>  

                    <p class="text-gray-400">${issue.description}</p>

                    <div class="w-11/12 mx-auto bg-gray-200 rounded-lg p-4 flex justify-between">
                        <div>
                            <p class="text-gray-400">Assignee:</p>
                            <h4 class="font-semibold">${issue.author}</h4>
                        </div>
                        <div>
                          <p class="text-gray-400">Priority:</p>
                        <span class="badge badge-error text-white">${issue.priority}</span>  
                        </div>
                        
                    </div>

                </div>
  `;
  document.getElementById("issue_modal").showModal();
}

let currentBtn = "all";
const btnActive = ["bg-primary", "text-white"];
const btnInactive = ["bg-transparent", "text-[#64748B]"];

const switchBtn = (btn) => {
  console.log(btn);
  const buttons = ["all", "open", "closed"];
  currentBtn = btn;

  for (const b of buttons) {
    const btnName = document.getElementById(b + "-btn");
    if (b === btn) {
      btnName.classList.remove(...btnInactive);
      btnName.classList.add(...btnActive);
    } else {
      btnName.classList.add(...btnInactive);
      btnName.classList.remove(...btnActive);
    }
  }

  document.getElementById("issue-container").classList.add("hidden");
  document.getElementById("open-issue-container").classList.add("hidden");
  document.getElementById("closed-issue-container").classList.add("hidden");

  if (btn == "all") {
    document.getElementById("issue-container").classList.remove("hidden");
  } else if (btn == "open") {
    document.getElementById("open-issue-container").classList.remove("hidden");
  } else {
    document
      .getElementById("closed-issue-container")
      .classList.remove("hidden");
  }
  
};
switchBtn(currentBtn);

const loadIssue = async () => {
  loadSpinner(true);
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const res = await fetch(url);
  const details = await res.json();
  displayIssue(details.data);
};

const displayIssue = (issues) => {
  const issuesContainer = document.getElementById("issue-container");
  issuesContainer.innerHTML = "";
  const openIssueContainer = document.getElementById("open-issue-container");
  openIssueContainer.innerHTML = "";
  const closedIssueContainer = document.getElementById(
    "closed-issue-container",
  );
  closedIssueContainer.innerHTML = "";

  for (let issue of issues) {
    const card = `
        <div onclick="loadModal(${issue.id})" class="rounded-md shadow-sm p-4 h-full space-y-3 border-t-2 ${
          issue.status === "open" ? "border-green-500" : "border-purple-500"
        }">
                    <div class="flex justify-between ">
                    ${issue.status === "open" ? "<img src='./assets/Open-Status.png'>" : "<img src='./assets/Closed-Status.png'>"}
                        <p class="font-medium badge badge-soft ${issue.priority === "high" ? "badge-error" : issue.priority === "medium" ? "badge-warning" : "badge-ghost text-gray-300"} ">${issue.priority}</p>
                    </div>
                    <div class="">
                        <h3 class="font-semibold">${issue.title}</h3>
                        <p class="text-gray-500 text-[12px] mb-3">${issue.description}</p>
                        <div class="flex flex-wrap gap-2 text-[10px]">
                            ${createElement(issue.labels)}
                        </div>                       
                    </div>
                    <hr class="text-gray-200"> 
                    <div>
                        <p class="text-[12px] text-gray-500 mb-2">#${issue.id} by ${issue.author}</p>
                        <p class="text-[12px] text-gray-500">${issue.createdAt}</p>
                    </div>
                </div>
    `;

    const issueDiv = document.createElement("div");
    issueDiv.innerHTML = card;
    issuesContainer.append(issueDiv);

    if (issue.status == "open") {
      const openDiv = document.createElement("div");
      openDiv.innerHTML = card;
      openIssueContainer.append(openDiv);
    } else if (issue.status == "closed") {
      const closedDiv = document.createElement("div");
      closedDiv.innerHTML = card;
      closedIssueContainer.append(closedDiv);
    }
  }
  countIssue();
  loadSpinner(false);
};

document.getElementById("btn-search").addEventListener("click", () => {
  const search = document.getElementById("search-issue");
  const searchValue = search.value.trim().toLowerCase();

  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      const allIssue = data.data;
      const filterWords = allIssue.filter((issue) => issue.title.toLowerCase().includes(searchValue));
      displayIssue(filterWords)
      countIssue();
    });
});

const issueCount =  document.getElementById("total-issues")
const countIssue = () => {
  const issuesContainer = document.getElementById("issue-container");
  const openIssueContainer = document.getElementById("open-issue-container");
  const closedIssueContainer = document.getElementById("closed-issue-container");

  const counts = {
    all: issuesContainer.children.length,
    open: openIssueContainer.children.length,
    closed: closedIssueContainer.children.length,
  };

  issueCount.innerText = counts[currentBtn]; 
};


loadIssue();




