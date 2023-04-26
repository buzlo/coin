import Chart from 'chart.js/auto';

export default function ($canvas, data) {
  const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;

      ctx.save();
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      ctx.setLineDash(options.borderDash || []);
      ctx.lineDashOffset = options.borderDashOffset;
      ctx.strokeRect(left, top, width, height);
      ctx.restore();
    },
  };

  const primaryColor = '#116ACC';

  new Chart($canvas, {
    type: 'bar',
    data: {
      labels: data.map((row) => row.monthName),
      datasets: [
        {
          data: data.map((row) => row.balance),
        },
      ],
    },
    plugins: [chartAreaBorder],
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        chartAreaBorder: {
          borderColor: 'black',
          borderWidth: 1,
        },
      },
      elements: {
        bar: {
          backgroundColor: primaryColor,
        },
      },
      scales: {
        y: {
          position: 'right',
        },
      },
    },
  });
}
