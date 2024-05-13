let chart;

const location_graph = (interval) => {
  let locPromise = fetch(
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
      let values = Object.values(data.data);
      loc = values[values.length - 1].pageviews_by_location;
      return loc;
    });

  locPromise.then((loc) => {
    const countryTotals = {}; // 국가별 합계를 저장할 객체

    // 위치 데이터를 순회하면서 도시의 이름을 가져와서 처리
    for (const key in loc) {
      if (Object.hasOwnProperty.call(loc, key)) {
        const parts = key.split(", "); // 쉼표를 기준으로 분리하여 국가와 도시를 분리
        const country = parts[1]; // 도시 이름
        const city = parts[0]; // 국가 이름

        // 국가별 합계를 계산하여 저장
        if (!countryTotals[country]) {
          countryTotals[country] = loc[key];
        } else {
          countryTotals[country] += loc[key];
        }
      }
    }
    function getCountryTotal(countryName) {
      // countryTotals 객체의 모든 키를 반복하면서 d.properties.name의 부분 문자열을 포함하는지 확인
      for (const key in countryTotals) {
        if (Object.hasOwnProperty.call(countryTotals, key)) {
          if (countryName.includes(key)) {
            // 부분 문자열이 포함된 경우 해당 값 반환
            return countryTotals[key];
          }
        }
      }
      // 찾지 못한 경우 0 반환
      return 0;
    }
    fetch("https://unpkg.com/world-atlas/countries-50m.json")
      .then((r) => r.json())
      .then((data) => {
        const countries = ChartGeo.topojson.feature(
          data,
          data.objects.countries
        ).features;

        const loc_ctx = document.getElementById("mapChart").getContext("2d");

        if (chart) {
          chart.destroy();
        }

        chart = new Chart(loc_ctx, {
          type: "choropleth",
          data: {
            labels: countries.map((d) => d.properties.name),
            datasets: [
              {
                label: "Countries",
                data: countries.map((d) => ({
                  feature: d,
                  value: getCountryTotal(d.properties.name),
                })),
              },
            ],
          },
          options: {
            showOutline: true,
            showGraticule: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              projection: {
                axis: "x",
                projection: "equalEarth",
              },
            },
          },
        });
      });
  });
};

let loc_interval = "daily";
location_graph(loc_interval);

// 모든 dropdown-item 요소 가져오기
const loc_dropdownItems = document.querySelectorAll(".dropdown-item");

// 클릭 이벤트 핸들러 내부에서 interval 변수를 정의하고 값 할당
loc_dropdownItems.forEach((item) => {
  item.addEventListener("click", function () {
    // 클릭된 dropdown-item의 텍스트 가져오기
    loc_interval = this.innerText.toLowerCase();
    // 새로운 차트 그리기
    location_graph(loc_interval);
  });
});
