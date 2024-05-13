// 함수를 이용하여 각 차트를 생성하고 관리하기 위한 코드
const createChart = (url, label, backgroundColor, chartId) => {
  let myChart;

  const graph = (interval) => {
    fetch(
      `https://analytics.weniv.co.kr/analytics/pageviews?url=${url}&date_start=${previousMonthDate}&date_end=${currentDate}&interval=${interval}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        let labels = Object.keys(data.data);
        let values = Object.values(data.data).map((item) => item.num);

        const chartData = {
          labels: labels,
          values: values,
        };

        const ctx = document.getElementById(chartId).getContext("2d");

        if (myChart) {
          myChart.destroy();
        }

        myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: chartData.labels,
            datasets: [
              {
                label: label,
                data: chartData.values,
                backgroundColor: backgroundColor,
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      })
      .catch((error) => console.error("Error:", error));
  };

  let interval = "daily";
  graph(interval);

  // 모든 dropdown-item 요소 가져오기
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  // 클릭 이벤트 핸들러 내부에서 interval 변수를 정의하고 값 할당
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      // 클릭된 dropdown-item의 텍스트 가져오기
      interval = this.innerText.toLowerCase();
      // 새로운 차트 그리기
      graph(interval);
    });
  });
};

// 서비스 URL 리스트
const serviceUrls = [
  "books.weniv",
  "weniv.link",
  "world.weniv",
  "sql.weniv",
  "notebook.weniv",
  // 나머지 서비스 URL 추가
];

const services = [
  "위니북스",
  "위니링크",
  "위니브월드",
  "위니브SQL",
  "위니브노트북",
];
const servicesContainer = document.querySelector(".row");

// 서비스 URL 리스트의 각 항목에 대해 차트 생성하고 관리하는 반복문
serviceUrls.forEach((url, index) => {
  const label = services[index];
  const backgroundColor = `rgba(${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, 0.6)`;
  const chartId = `service${index + 1}Chart`;

  // 새로운 카드를 생성하여 HTML에 추가
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("col-md-4");
  cardDiv.innerHTML = `
      <div class="card mt-4">
        <div class="card-body">
          <h5 class="card-title">${label}</h5>
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              기간 설정
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li><a class="dropdown-item" href="#">Daily</a></li>
              <li><a class="dropdown-item" href="#">Weekly</a></li>
              <li><a class="dropdown-item" href="#">Monthly</a></li>
            </ul>
          </div>
          <canvas id="${chartId}"></canvas>
        </div>
      </div>
    `;

  servicesContainer.appendChild(cardDiv);

  // 각 차트를 생성하고 관리하는 함수 호출
  createChart(url, label, backgroundColor, chartId);
});
