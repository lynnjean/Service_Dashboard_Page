// 현재 날짜를 가져오는 함수
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 문자열로 변환
  const day = String(today.getDate()).padStart(2, "0"); // 날짜를 가져옴
  let previousMonth = parseInt(month) - 1;
  if (previousMonth === 0) {
    year = String(parseInt(year) - 1);
    previousMonth = "12";
  } else {
    previousMonth = String(previousMonth).padStart(2, "0");
  }
  return [`${year}${month}${day}`, `${year}${previousMonth}${day}`]; // YYYYMMDD 형식의 문자열로 반환
};

// 현재 날짜를 가져옴
const currentDate = getCurrentDate()[0];
const previousMonthDate = getCurrentDate()[1];
