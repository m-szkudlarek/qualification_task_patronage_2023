import { returnStringInLang } from "../utilities.js";

class ChartView {
  #parentElement;
  #charts = [];
  init() {
    this.#parentElement = document.querySelector(".graphs");
    Chart.defaults.color = "rgb(35, 35, 35)";
    Chart.defaults.font.size = 16;
  }
  #createBoxChart() {
    const div = document.createElement("div");
    div.setAttribute("class", "chart__box stretched");
    const canvas = document.createElement("canvas");
    div.appendChild(canvas);

    return div;
  }

  addChartToView(chart) {
    if (window.matchMedia("(max-width: 768px)").matches) {
      const li = document.createElement("li");
      li.setAttribute("class", "carousel__slide stretched");
      li.appendChild(chart);
      this.#parentElement.querySelector("ul").appendChild(li);
      // add dot to navigation
      const dot = document.createElement("button");
      dot.setAttribute("class", "carousel__dot");
      this.#parentElement.querySelector(".carousel__nav").appendChild(dot);
    } else this.#parentElement.appendChild(chart);
  }

  reloadChartLabels(lang, tTypes) {
    this.#charts.forEach((chart) => {
      if (chart.config.type === "pie") {
        chart.data.labels = Object.values(tTypes);
        chart.options.plugins.title.text = returnStringInLang(
          lang,
          "Typy transakcji",
          "Transactions types"
        );
      }
      if (chart.config.type === "bar") {
        chart.data.datasets[0].label = returnStringInLang(
          lang,
          "Saldo",
          "Balance"
        );
        chart.options.plugins.title.text = returnStringInLang(
          lang,
          "Saldo",
          "Balance"
        );
      }
      chart.update();
    });
  }

  #coloredBar() {
    return (ctx) => {
      const v = ctx.parsed.y;
      const color = v < 0 ? "rgb(255, 0, 0)" : "rgb(0, 189, 0)";

      return color;
    };
  }
  createPieChart(lang, t, tTypes) {
    const placeholder = this.#createBoxChart();
    const canvas = placeholder.firstChild;

    const pieData = {};
    const types = Object.keys(tTypes);
    types.forEach((number) => {
      let counter = 0;
      t.forEach((element) => element.type === Number(number) && counter++);
      pieData[tTypes[number]] = counter;
    });

    const obj = new Chart(canvas, {
      type: "pie",
      data: {
        labels: Object.keys(pieData),
        datasets: [
          {
            data: Object.values(pieData),
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: false,
          title: {
            display: true,
            text: returnStringInLang(
              lang,
              "Typy transakcji",
              "Transactions types"
            ),
            font: {
              size: 24,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.parsed;
                const numberGivenType = Array.from(context.dataset.data);
                const numberTransactions = numberGivenType.reduce(
                  (accumulator, currentValue) => accumulator + currentValue
                );

                const procentageValue = `${(
                  (value / numberTransactions) *
                  100
                ).toFixed(2)}%`;
                return procentageValue;
              },
            },
          },
        },
        maintainAspectRatio: false,
      },
    });
    this.#charts.push(obj);
    return placeholder;
  }
  createBarChart(lang, t) {
    const placeholder = this.#createBoxChart();
    const canvas = placeholder.firstChild;
    const barData = {};
    const reversTransactions = [...t].reverse();

    let prevDate = new Date(reversTransactions[0].date);
    reversTransactions.forEach((element, index) => {
      const dateD = new Date(element.date);
      if (prevDate.getTime() !== dateD.getTime())
        barData[reversTransactions[index - 1].date] =
          reversTransactions[index - 1].balance;
      prevDate = dateD;
    });
    barData[reversTransactions[reversTransactions.length - 1].date] =
      reversTransactions[reversTransactions.length - 1].balance;

    const obj = new Chart(canvas, {
      type: "bar",
      data: {
        labels: Object.keys(barData),
        datasets: [
          {
            label: returnStringInLang(lang, "Saldo", "Balance"),
            data: Object.values(barData),
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: false,
          title: {
            display: true,
            text: returnStringInLang(lang, "Saldo", "Balance"),
            font: {
              size: 24,
            },
          },
        },
        elements: {
          bar: {
            backgroundColor: this.#coloredBar(),
            borderColor: "rgb(35,35,35)",
            borderWidth: 2,
          },
        },
        scales: {
          y: {
            grid: {
              color: function (context) {
                if (context.tick.value === 0) return "rgb(35,35,35)";
                return "rgb(100,100,100)";
              },
              lineWidth: function (context) {
                if (context.tick.value === 0) return 3;
                return 1;
              },
            },
          },
        },
        maintainAspectRatio: false,
      },
    });
    this.#charts.push(obj);
    return placeholder;
  }
}
export default new ChartView();
