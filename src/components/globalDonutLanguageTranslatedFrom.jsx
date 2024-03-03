import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

function Donut  () {
    const [languageCodes, setLanguageCodes] = useState([]);
    const [languageNumber, setLanguageNumber] = useState([]);

    useEffect(() => {
        const language = [];
        const number = [];
      
        axios({
          method: 'GET',
          url: 'http://127.0.0.1:5000/globalStatisticsTranslateFrom',
        })
          .then((response) => {
            console.log(response.data);
            language.push(...response.data.map((stat) => stat[0]));
            number.push(...response.data.map((stat) => stat[1]));
            if (language.length === 0) {
              number.push(0);
              language.push('No translations made yet');
            }
            setLanguageCodes(language);
            setLanguageNumber(number);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

       // console.log("Codes Global",languageCodes);
       // console.log("Number Global",languageNumber);


    return(
        <React.Fragment>
        <div className='container-fluid mt-3 mb-3'>      
        <Chart 
        type="donut"
        width={500}
        series={languageNumber}

        options={{
            colors: ['#FF4560', '#00E396','#FEB019','#008FFB', '#775DD0','#CE6B25','#CC63B0','#298900','#1B2E87'],
            plotOptions: {
                pie:{
                    donut:{
                        labels:{
                            show:true
                        }
                    }
                }
            },
            chart: {
              toolbar: {
                show: true,
              },
                foreColor: '#000',
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
              },
            labels:languageCodes,
            legend: {
                fontSize: '16px',
                show: true,
                position: 'bottom',
              },
              title: {
                text: 'Most languages translated from in the last 30 days',
                align: 'center', // add this line to center the title
              },
        }}
        /></div>
        </React.Fragment>
    )
}

export default Donut;