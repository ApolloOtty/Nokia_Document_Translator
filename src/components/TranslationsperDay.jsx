import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios'

const TranslationChart = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'translation-chart',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [],
      },
      title: {
        text: 'Number of translations made in the last 30 days',
        align: 'center',
        offsetY: 10,
        style: {
          fontSize: '20px',
        },
      },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
    },
    series: [
      {
        name: 'Translations',
        data: [],
      },
    ],
  });

  useEffect(() => {
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/translations_per_day',
      data: {
        userID: localStorage.getItem('userID'),
      },
    })
      .then((response) => {
        //console.log('cucu', response.data);
       // console.log('CUCU', response.data.day[1]);

        const translationsByDay = [];
        for (let i = 0; i < 30; i++) {
          translationsByDay.push({
            day: response.data.day[i],
            translations: response.data.value[i],
          });
        }

        const categories = translationsByDay.map((item) => item.day);
        const data = translationsByDay.map((item) => item.translations);

        setChartData((prevState) => ({
          ...prevState,
          options: {
            ...prevState.options,
            chart: {
              toolbar: {
                show: true,
              },
            },
            xaxis: {
              categories: categories,
              labels: {
                style: {
                  fontSize: '16px', // Modify the font size as desired
                },
              },
            },
          },
          series: [
            {
              ...prevState.series[0],
              data: data,
            },
          ],
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default TranslationChart;
