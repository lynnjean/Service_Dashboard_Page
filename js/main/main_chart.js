let myChart;
const graph = (interval) => {
  // 30일 페이지뷰 데이터 (임의의 데이터입니다. 실제로는 서버에서 가져와야 합니다.)
  fetch(
    `https://analytics.weniv.co.kr/analytics/pageviews?url=weniv&date_start=${previousMonthDate}&date_end=${currentDate}&interval=${interval}`, //
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
      const pageViewData = {
        labels: labels,
        values: values,
      };

      // 이전 차트 파괴
      if (myChart) {
        myChart.destroy();
      }

      // 차트 그리기
      const ctx = document.getElementById("pageViewChart").getContext("2d");

      myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: pageViewData.labels,
          datasets: [
            {
              label: "Page Views",
              data: pageViewData.values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              stepSize: 100,
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
