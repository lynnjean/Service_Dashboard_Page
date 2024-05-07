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
  "https://www.books.weniv.co.kr/",
  "https://weniv.link/",
  // 나머지 서비스 URL 추가
];

const services = document.querySelectorAll(".card-title");
const titlesList = [];

services.forEach((service) => {
  titlesList.push(service.textContent);
});

// 서비스 URL 리스트의 각 항목에 대해 차트 생성하고 관리하는 반복문
serviceUrls.forEach((url, index) => {
  const label = titlesList[index];
  const backgroundColor = `rgba(${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, 0.6)`;
  const chartId = `service${index + 1}Chart`;

  // 각 차트를 생성하고 관리하는 함수 호출
  createChart(url, label, backgroundColor, chartId);
});
