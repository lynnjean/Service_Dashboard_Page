function generateRandomColorList(os) {
  const colorList = [];

  // 랜덤한 배경색 생성
  for (let i = 0; i < Object.values(os).length; i++) {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // 랜덤한 색상 코드 생성
    colorList.push(randomColor); // 리스트에 추가
  }

  return colorList;
}

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
    os = values[values.length - 1].pageviews_by_os;

    // 차트 그리기
    const os_ctx = document.getElementById("os").getContext("2d");

    new Chart(os_ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(os),
        datasets: [
          {
            label: "os",
            data: Object.values(os),
            backgroundColor: generateRandomColorList(os),
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
