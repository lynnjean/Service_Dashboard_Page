// 30일 페이지뷰 데이터 (임의의 데이터입니다. 실제로는 서버에서 가져와야 합니다.)
fetch(
  `https://analytics.weniv.co.kr/analytics/pageviews?url=weniv&date_start=${previousMonthDate}&date_end=${currentDate}`, //
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
    let values = Object.values(data.data);
    device = values[values.length - 1].pageviews_by_device;

    // 차트 그리기
    const device_ctx = document.getElementById("mobile_pc").getContext("2d");

    new Chart(device_ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(device),
        datasets: [
          {
            label: "device",
            data: Object.values(device),
            backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
            hoverOffset: 4,
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
