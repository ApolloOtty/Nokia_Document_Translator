import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, textFieldClasses } from '@mui/material';
import Box from '@mui/material/Box';
import axios from '../api/axios';
import Drawer from '../components/Drawer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DonutFrom from '../components/DonutLanguageTranslatedFrom';
import DonutTo from '../components/DonutLanguageTranslatedTo';
import DonutGlobalFrom from '../components/globalDonutLanguageTranslatedFrom';
import DonutGlobalTo from '../components/globalDonutLanguageTranslatedTo';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TranslationChart from '../components/TranslationsperDay';

export default function TwoTextBoxes() {
  const [translatedText, setTranslatedText] = useState(' ');
  const [language, setLanguage] = React.useState('');
  const [language2, setLanguage2] = React.useState('');
  const [docx, setDocx] = React.useState(0);
  const [txt, setTxt] = React.useState(0);
  const [xlsx, setXlsx] = React.useState(0);





  useEffect(() => {
    //console.log("NOA",localStorage.getItem('country_code'))
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/file_counts',
      data: { userID: localStorage.getItem('userID') },
    })
      .then((response) => {
      //  console.log(response.data.data)
        setTxt(response.data.data[".txt"])
        setDocx(response.data.data[".docx"])
        setXlsx(response.data.data[".xlsx"])
      })
      .catch((error) => {
      //  console.error(error);
      });
  },[]);






  const handleSubmit = (event) => {
    // Here you can add your translation logic
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const translateText=data.get('textTranslate');

    //console.log(language, language2);


    axios({method: 'POST', url: 'http://127.0.0.1:5000/translate', data: {
      translateText: translateText,
      textTo: language2,
      textFrom: language
    },
    })
    .then((response) => {
      //console.log(response.data);
     // console.log(translateText)
      setTranslatedText(response.data);
    })
    .catch((error) => {
     // console.error(error);
     // console.log(error.data)
      setTranslatedText(error.data);
    });

  };


  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleChange2 = (event) => {
    setLanguage2(event.target.value);
  };

  return (
    <>
  
      <Box
        sx={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
            <Button variant='contained' sx={{ marginBottom: 10 }} href="/statistics">
        <Typography variant="h7" component="h2" sx={{ marginTop: 0 }}>
           Go to Global statistics
        </Typography>
    </Button>
    
    <Typography variant="h7" component="h2" sx={{ marginTop: 0 }}>
      Your personal statistics: 
    </Typography>

    <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        <Grid
          item
          mx={15}
          sx={{
            background: '#FED700',
            borderRadius: '10px',
            width: '20vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <h3>Text files translated: {txt}</h3>
        </Grid>
        <Grid
          item
          mx={15}
          sx={{
            background: '#1976D2',
            borderRadius: '10px',
            width: '20vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
          <h3>Word documents translated: {docx}</h3>
        </Grid>
        <Grid
          item
          mx={15}
          sx={{
            background: '#21A366',
            borderRadius: '10px',
            width: '20vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
          <h3>Excel documents translated: {xlsx}</h3>
        </Grid>

    </Box>
        <Drawer />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid item mx={15} sx={{background: 'lightgrey', borderRadius: '10px'}}>
            <DonutFrom />
          </Grid>
          <Grid item mx={15} sx={{background: 'lightgrey', borderRadius: '10px'}}>
            <DonutTo />
          </Grid>




          

        </Box>

        <Grid item mx={15} sx={{background: 'lightgrey', borderRadius: '10px', width: '65vw', marginTop: '2vw'}}>
            <TranslationChart></TranslationChart>
        </Grid>
        </Box>
    </>
  );
}
