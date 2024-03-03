import React from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios'
import { useState, useEffect } from 'react';


const PolarChart = () => {

    const [countries, setCountries] = useState([]);
    const [values, setValues] = useState([]);

    useEffect(() => {
        axios({
          method: 'POST',
          url: 'http://127.0.0.1:5000/top_10_countries',
        })
          .then((response) => {
            const countriesData = [];
            const valuesData = [];
    
            for (let i = 0; i < response.data.data.length; i++) {
              const country = response.data.data[i].country;
              const translationCount = response.data.data[i].translation_count;
    
              countriesData.push(country);
              valuesData.push(translationCount);
            }
    
            setCountries(countriesData);
            setValues(valuesData);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);


  // Sample data for 10 countries and their translation counts
  const data = {
    series: values,
    options: {
      chart: {
        toolbar: {
          show: true,
        },
        type: 'polarArea',
      },
      title: {
        text: 'Top 10 countries with most translations',
        align: 'center', // add this line to center the title
      },
      labels: countries,
      stroke: {
        colors: ['#fff'],
      },
      fill: {
        opacity: 0.8,
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      }],
    },
  };

  return (
    <div>
      <Chart
        options={data.options}
        series={data.series}
        type="polarArea"
        height={400}
      />
    </div>
  );
};

export default PolarChart;
