fetch(
  `https://analytics.weniv.co.kr/analytics/pageviews?url=weniv&date_start=${previousMonthDate}&date_end=${currentDate}&interval=monthly`
)
  .then((response) => response.json())
  .then((data) => {
    const getPreviousMonthDates = (currentDate) => {
      const year = currentDate.substr(0, 4);
      const month = currentDate.substr(4, 2);
      let previousYear = year;
      let previousMonth = parseInt(month) - 1;
      if (previousMonth === 0) {
        previousYear = String(parseInt(year) - 1);
        previousMonth = "12";
      } else {
        previousMonth = String(previousMonth).padStart(2, "0");
      }
      const previousMonthStartDate = `${previousYear}${previousMonth}01`; // 전 월의 시작일
      const previousMonthEndDate = `${year}${month}01`; // 전 월의 종료일
      return [previousMonthStartDate, previousMonthEndDate]; // 전 월의 시작일과 종료일을 배열로 반환
    };

    // 전 월의 시작일과 종료일을 가져옴
    const [previousMonthStartDate, previousMonthEndDate] =
      getPreviousMonthDates(currentDate);

    // 전 월의 데이터를 가져옴
    let previousMonthData =
      data.data[`${previousMonthStartDate}-${previousMonthEndDate}`];

    // 데이터가 없는 경우에는 그 이전 월의 데이터를 가져옴
    if (!previousMonthData) {
      for (const key in data.data) {
        if (Object.hasOwnProperty.call(data.data, key)) {
          previousMonthData = data.data[key].num;
        }
      }
    }
    document.getElementById("mau").innerText = previousMonthData;
  })
  .catch((error) => console.error("Error fetching MAU data:", error));

fetch(
  `https://analytics.weniv.co.kr/analytics/pageviews?url=weniv&date_start=${previousMonthDate}&date_end=${currentDate}&interval=weekly`
)
  .then((response) => response.json())
  .then((data) => {
    // 전 주의 시작일과 종료일을 계산하는 함수
    const getPreviousWeekDates = (currentDate) => {
      const today = new Date(
        currentDate.substr(0, 4),
        Number(currentDate.substr(4, 2)) - 1,
        currentDate.substr(6, 2)
      ); // 현재 날짜 객체 생성
      const previousWeekStart = new Date(
        today.getTime() - 7 * 24 * 60 * 60 * 1000
      ); // 전 주의 시작일 계산
      const previousWeekEnd = new Date(
        today.getTime() - 1 * 24 * 60 * 60 * 1000
      ); // 전 주의 종료일 계산
      const previousWeekStartDate = `${previousWeekStart.getFullYear()}${String(
        previousWeekStart.getMonth() + 1
      ).padStart(2, "0")}${String(previousWeekStart.getDate()).padStart(
        2,
        "0"
      )}`; // YYYYMMDD 형식의 문자열로 변환
      const previousWeekEndDate = `${previousWeekEnd.getFullYear()}${String(
        previousWeekEnd.getMonth() + 1
      ).padStart(2, "0")}${String(previousWeekEnd.getDate()).padStart(2, "0")}`; // YYYYMMDD 형식의 문자열로 변환
      return [previousWeekStartDate, previousWeekEndDate]; // 전 주의 시작일과 종료일을 배열로 반환
    };

    // 전 주의 시작일과 종료일을 가져옴
    const [previousWeekStartDate, previousWeekEndDate] =
      getPreviousWeekDates(currentDate);

    // 전 주의 데이터를 가져옴
    let previousWeekData =
      data.data[`${previousWeekStartDate}-${previousWeekEndDate}`];

    // 데이터가 없는 경우에는 그 이전 주의 데이터를 가져옴
    if (!previousWeekData) {
      for (const key in data.data) {
        if (Object.hasOwnProperty.call(data.data, key)) {
          previousWeekData = data.data[key].num;
        }
      }
    }
    // console.log(previousWeekData.num);ss
    document.getElementById("wau").innerText = previousWeekData.num;
  })
  .catch((error) => console.error("Error fetching MAU data:", error));

fetch(
  `https://analytics.weniv.co.kr/analytics/pageviews?url=weniv&date_start=${previousMonthDate}&date_end=${currentDate}&interval = `,
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

    document.getElementById("dau").innerText = values[values.length - 1]; // 'mau'는 받아온 데이터의 키에 따라 수정
  });
