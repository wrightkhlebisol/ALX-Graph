let canvasNode = null;

function createAndAppendNode() {
  let locationPath = document.querySelector("body > main > article > div > div > div:nth-child(2)");

  let { containerNode, header, heading3, titleNode, buttonNodeSpan, buttonMonth, buttonProject, bodyNode, canvasNode } = nodeCreator();

  nodeProperties(containerNode, header, heading3, titleNode, buttonNodeSpan, buttonMonth, buttonProject, bodyNode, canvasNode, locationPath);

  // createChart(canvasNode)
  let monthScores = getMonthlyScores();
  console.log({ monthScores });
  sendMessage(monthScores);
}

function nodeProperties(containerNode, header, heading3, titleNode, buttonNodeSpan, buttonMonth, buttonProject, bodyNode, canvasNode, locationPath) {
  containerNode.classList.add("panel", "panel-default");

  header.classList.add("panel-heading", "panel-heading-actions");
  heading3.textContent = "Score Graph";
  heading3.classList.add("panel-title");
  titleNode.appendChild(heading3);

  header.appendChild(titleNode);

  buttonNodeSpan.classList.add("buttonOpts");
  buttonMonth.textContent = "Month";
  buttonMonth.classList.add("month-btn");
  buttonProject.textContent = "Project";
  buttonProject.classList.add("proj-btn");

  buttonNodeSpan.appendChild(buttonMonth);
  buttonNodeSpan.appendChild(buttonProject);

  header.appendChild(buttonNodeSpan);

  bodyNode.classList.add("graph");
  bodyNode.setAttribute("id", "myChart");
  // canvasNode.setAttribute("id", "c_chart");
  bodyNode.appendChild(canvasNode.canvas);

  // Add header and body node to parent
  containerNode.appendChild(header);
  containerNode.appendChild(bodyNode);

  // Add new node to content location
  let firstChildNode = locationPath.firstChild;
  locationPath.insertBefore(containerNode, firstChildNode);
}

function nodeCreator() {
  let containerNode = document.createElement("div");
  let header = document.createElement("div");
  let titleNode = document.createElement("div");
  let heading3 = document.createElement("h3");
  let buttonNodeSpan = document.createElement("span");
  let buttonMonth = document.createElement("button");
  let buttonProject = document.createElement("button");
  let bodyNode = document.createElement("div");
  canvasNode = document.createElement("canvas");
  canvasNode.setAttribute("id", "c_chart");
  canvasNode = canvasNode.getContext('2d');
  return { containerNode, header, heading3, titleNode, buttonNodeSpan, buttonMonth, buttonProject, bodyNode, canvasNode };
}

function getMonthlyScores() {
  let monthlyScoreTable = document.querySelector("body > main > article > div > div > div:nth-child(2) > div.panel.panel-default > table > tbody")
  let monthsLength = monthlyScoreTable.rows.length;
  let monthScoresArr = [], i = 0;

  while (i < monthsLength) {
    monthScoresArr.push(parseInt(monthlyScoreTable.rows[i].cells[1].innerText));
    i++;
  }

  // communicate with the popup script
  return monthScoresArr;
}

function getProjectScores() {
  let monthlyScoreTable = document.querySelector("#period_scores_modal_1 > div > div > div.modal-body > table > tbody");
  let projectScoresArr = [], i = 0;
  let projectsLength = projectScoreTable.rows.length;

  while (i < projectsLength) {
    projectScoresArr.push(parseInt(projectScoreTable.rows[i].cells[1].innerText));
    i++;
  }

  // communicate with the popup script
  return projectScoresArr;
}

/**
 * sendMessage - Send a message using the runtime
 */
function sendMessage(cScriptMessage) {
  chrome.runtime.sendMessage({
    cScriptMessage
  }, (res) => console.log("Response: ", res))
}

function recieveMessage() {
  chrome.runtime.onMessage.addListener((message, sender, responseFunc) => {
    console.log("Message received in popup: ", message);
    responseFunc({ response });
  })
}

async function initPage(ctx) {
  // let scriptUrl = chrome.runtime.getURL("chart.js");
  // let scriptElement = document.createElement("script");
  // scriptElement.src = scriptUrl;

  // Specify the URL of the external script you want to load
  const externalScriptUrl = await chrome.runtime.getURL('chart.js')
  console.log({ externalScriptUrl });

  // Load the external script
  loadExternalScript(externalScriptUrl);

  // console.log(scriptElement);
  // document.head.appendChild(scriptElement);
  let scoreArr = getMonthlyScores();
  createAndAppendNode(scoreArr);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}

// Function to load an external script
function loadExternalScript(scriptUrl) {
  const script = document.createElement('script');
  // script.setAttribute('')
  script.src = scriptUrl;
  script.type = 'text/javascript';
  document.head.appendChild(script);
}

// Function to create a sample chart
function createChart(ctx) {
  // var ctx = document.createElement('canvas').getContext('2d');
  // document.body.appendChild(ctx.canvas);

  console.log({ ctx })
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

initPage(canvasNode);
