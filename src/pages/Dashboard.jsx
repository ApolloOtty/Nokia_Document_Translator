import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, textFieldClasses, Input, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import axios from '../api/axios';
import Drawer from '../components/Drawer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DonutFrom from '../components/DonutLanguageTranslatedFrom';
import DonutTo from '../components/DonutLanguageTranslatedTo';
import LanguageOptions from '../components/LanguageOptions';
import * as XLSX from "xlsx";
import * as Docx from "docx";
import {RiArrowLeftRightLine} from 'react-icons/ri';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import History from '../components/bottomHistory';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import FileDialog from '../components/FilesDialog.jsx'



export default function Dashboard(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [upload1, setUpload1] = useState(false);
  const [upload2, setUpload2] = useState(false);
  const [translation, setTranslation] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [translatedText, setTranslatedText] = useState(' ');
  const [originalText, setOriginalText] = useState(' ');
  const [language, setLanguage] = useState('auto');
  const [language2, setLanguage2] = useState(localStorage.getItem('country_code').toLowerCase());
  const [languageFile, setLanguageFile] = useState('');
  const [languageFile2, setLanguageFile2] = useState('');
  const [file, setFile] = useState(null);
  const [fileContents, setFileContents] = useState(null);
  const [fileContentsOriginal, setFileContentsOriginal] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(true);




  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  
  const handleFileCheck = (event) => {
    
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      
      if (fileType === 'txt'){
        handleFileUpload();
      } else if(fileType === 'docx') {
        handleFileUploadDocx();
      } else if (fileType === 'xlsx'){
        handleFileUploadXlsx();
      }else{
        // Handle unsupported file types or display an error message
        console.log('Unsupported file type');
      }
    }
  };
  

  const TransparentButton = styled(Button)({
    position: 'relative',
    minWidth: 120,
    marginLeft: 'auto',
    marginRight: -2,
    background: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      transform: 'scale(1.2)',
      transition: 'transform 0.3s ease-in-out',
    },
    
    boxShadow: 'none',
  });

  const TransparentButtonFile = styled(Button)({
    minWidth: 120,
    background: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      transform: 'scale(1.2)',
      transition: 'transform 0.3s ease-in-out',
      
    },
    boxShadow: 'none',
  });

  const SwapTexts = () => {
    const temp = originalText;
    setOriginalText(translatedText);
    setTranslatedText(temp);
  };

  const changeLanguages = () => {
    const temp = language;
    setLanguage(language2);
    setLanguage2(temp);
    SwapTexts();
  }

  const changeLanguageFile = () => {
    const temp = languageFile;
    setLanguageFile(languageFile2);
    setLanguageFile2(temp);
  }

  

  const handleFileUpload = () => {
    setIsUploaded(true);
    const reader = new FileReader();
    reader.readAsText(file);
    setFileContentsOriginal(reader.result);

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userID', localStorage.getItem('userID'));

    axios.post('http://127.0.0.1:5000/upload_file', formData, {
    })
      .then((response) => {
        ///console.log("Upload");
        //console.log("Upload", response.data);
        setLoading(true);
      })
      .catch((error) => {
       // console.log("Upload Error");
       // console.error(error);
      });
  };



  const handleFileUploadDocx = () => {
    setIsUploaded(true);
    const reader = new FileReader();
  
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userID', localStorage.getItem('userID'));

    axios.post('http://127.0.0.1:5000/upload_file', formData, {
    })
      .then((response) => {
       // console.log("Upload", response.data);
        setLoading(true);
      })
      .catch((error) => {
      //  console.error(error);
      });
  };

  const handleFileUploadXlsx = () => {
    setIsUploaded(true);
    const reader = new FileReader();
  
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userID', localStorage.getItem('userID'));

    axios.post('http://127.0.0.1:5000/upload_file', formData, {
    })
      .then((response) => {
       // console.log("Upload", response.data);
        setLoading(true);
      })
      .catch((error) => {
       // console.error(error);
      });
  };


  const handleInputChange = (event) => {
    const data = new FormData(event.currentTarget);
    const inputText = event.target.value;
    setTranslation(inputText);
  
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  if(inputText.length > 0)
    setTimeoutId(setTimeout(() => {
      axios({method: 'POST', url: 'http://127.0.0.1:5000/insertTranslate', data: {
      OriginalText: data.get('textTranslate'),
      SourceLanguage: language2,
      TargetLanguage: language,
      UserID: localStorage.getItem('userID'),
      translatedText: localStorage.getItem('translatedText')
    },
    })
    .then((response) => {
     // console.log(response.data);
    })
    .catch((error) => {
     // console.error(error);
     // console.log(error.data)
    });
    }, 2000));
  
    // Call translation function here
    handleSubmit(event);
  }



  const handleSubmit = (event) => {
    // Here you can add your translation logic
    const data = new FormData(event.currentTarget);

    const translateText=data.get('textTranslate');
    setOriginalText(translateText);
   // console.log(language, language2);
    //console.log(localStorage.getItem('userID'));

    axios({method: 'POST', url: 'http://127.0.0.1:5000/translate', data: {
      OriginalText: translateText,
      SourceLanguage: language2,
      TargetLanguage: language,
      UserID: localStorage.getItem('userID')
    },
    })
    .then((response) => {
     // console.log(response.data);
     // console.log(translateText)
      setTranslatedText(response.data);
      localStorage.setItem('translatedText', response.data);
    })
    .catch((error) => {
     // console.error(error);
     // console.log(error.data)
      setTranslatedText(error.data);
      setErrorMessage(error.data);
    });

  };


  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleChange2 = (event) => {
    setLanguage2(event.target.value);
  };

  const handleChangeFile = (event) => {
    setLanguageFile(event.target.value);
    setUpload1(true);
  };

  const handleChangeFile2 = (event) => {
    setLanguageFile2(event.target.value);
    setUpload2(true);
  };

  let isSpeaking = false; // declare a variable to keep track of whether audio is currently playing

  const synth = window.speechSynthesis;


  const readText=()=>{
    const text=translatedText;
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  let limbaj=language2;
  if (language2 === "de") {
    limbaj="de-DE"
  } else if (language2 === "fr") {
    limbaj="fr-FR"
  } else if (language2 === "ro") {
    limbaj="ro-RO"
  } else if (language2 === "en") {
    limbaj="en-US"
  }
  console.log(limbaj);
  const voice = voices.find((v) => v.lang === limbaj);
  if (voice) {
    utterance.voice = voice;
  } else {
    console.warn(`Voice for language ${language2} not found`);
  }

  if (isSpeaking) { // check if audio is already playing
    speechSynthesis.cancel(); // stop the audio if it is already playing
    isSpeaking = false; // set isSpeaking to false
  } else {
    speechSynthesis.speak(utterance); // start playing the audio if it is not already playing
    isSpeaking = true; // set isSpeaking to true
  }
}

const readTextFile=()=>{
  const text=fileContents;
const utterance = new SpeechSynthesisUtterance(text);
const voices = speechSynthesis.getVoices();
let limbaj=languageFile2;
if (languageFile2 === "de") {
  limbaj="de-DE"
} else if (languageFile2 === "fr") {
  limbaj="fr-FR"
} else if (languageFile2 === "ro") {
  limbaj="ro-RO"
} else if (languageFile2 === "en") {
  limbaj="en-US"
}
console.log(limbaj);
const voice = voices.find((v) => v.lang === limbaj);
if (voice) {
  utterance.voice = voice;
} else {
  console.warn(`Voice for language ${languageFile2} not found`);
}

if (isSpeaking) { // check if audio is already playing
  speechSynthesis.cancel(); // stop the audio if it is already playing
  isSpeaking = false; // set isSpeaking to false
} else {
  speechSynthesis.speak(utterance); // start playing the audio if it is not already playing
  isSpeaking = true; // set isSpeaking to true
}
}


  const updateTextFields = (original, translated, language, language2) => {
    setOriginalText(original);
    setTranslatedText(translated);
    setLanguage(language);
    setLanguage2(language2);
};

  return (
    
    <Box
  sx={{
    marginTop: 10,
    marginLeft: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Drawer></Drawer>
  <Box sx={{ display: 'flex' }}>
  {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
  <FormControl sx={{ minWidth: 200 }}>
    <InputLabel id="demo-simple-select-label"></InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={language}
        onChange={handleChange}
        name="languageFrom"

      >
        <MenuItem value={'auto'}>Detect Language</MenuItem>
        <MenuItem value={'af'}>Afrikaans</MenuItem>
        <MenuItem value={'sq'}>Albanian</MenuItem>
        <MenuItem value={'am'}>Amharic</MenuItem>
        <MenuItem value={'ar'}>Arabic</MenuItem>
        <MenuItem value={'hy'}>Armenian</MenuItem>
        <MenuItem value={'az'}>Azerbaijani</MenuItem>
        <MenuItem value={'eu'}>Basque</MenuItem>
        <MenuItem value={'be'}>Belarusian</MenuItem>
        <MenuItem value={'bn'}>Bengali</MenuItem>
        <MenuItem value={'bs'}>Bosnian</MenuItem>
        <MenuItem value={'bg'}>Bulgarian</MenuItem>
        <MenuItem value={'ca'}>Catalan</MenuItem>
        <MenuItem value={'ceb'}>Cebuano</MenuItem>
        <MenuItem value={'ny'}>Chichewa</MenuItem>
        <MenuItem value={'zh-CN'}>Chinese (Simplified)</MenuItem>
        <MenuItem value={'zh-TW'}>Chinese (Traditional)</MenuItem>
        <MenuItem value={'co'}>Corsican</MenuItem>
        <MenuItem value={'hr'}>Croatian</MenuItem>
        <MenuItem value={'cs'}>Czech</MenuItem>
        <MenuItem value={'da'}>Danish</MenuItem>
        <MenuItem value={'nl'}>Dutch</MenuItem>
        <MenuItem value={'en'}>English</MenuItem>
        <MenuItem value={'eo'}>Esperanto</MenuItem>
        <MenuItem value={'et'}>Estonian</MenuItem>
        <MenuItem value={'tl'}>Filipino</MenuItem>
        <MenuItem value={'fi'}>Finnish</MenuItem>
        <MenuItem value={'fr'}>French</MenuItem>
        <MenuItem value={'fy'}>Frisian</MenuItem>
        <MenuItem value={'gl'}>Galician</MenuItem>
        <MenuItem value={'ka'}>Georgian</MenuItem>
        <MenuItem value={'de'}>German</MenuItem>
        <MenuItem value={'el'}>Greek</MenuItem>
        <MenuItem value={'gu'}>Gujarati</MenuItem>
        <MenuItem value={'ht'}>Haitian Creole</MenuItem>
        <MenuItem value={'ha'}>Hausa</MenuItem>
        <MenuItem value={'haw'}>Hawaiian</MenuItem>
        <MenuItem value={'iw'}>Hebrew</MenuItem>
        <MenuItem value={'hi'}>Hindi</MenuItem>
        <MenuItem value={'hmn'}>Hmong</MenuItem>
        <MenuItem value={'hu'}>Hungarian</MenuItem>
        <MenuItem value={'is'}>Icelandic</MenuItem>
        <MenuItem value={'ig'}>Igbo</MenuItem>
        <MenuItem value={'id'}>Indonesian</MenuItem>
        <MenuItem value={'ga'}>Irish</MenuItem>
        <MenuItem value={'it'}>Italian</MenuItem>
        <MenuItem value={'ja'}>Japanese</MenuItem>
        <MenuItem value={'jw'}>Javanese</MenuItem>
        <MenuItem value={'kn'}>Kannada</MenuItem>
        <MenuItem value={'kk'}>Kazakh</MenuItem>
        <MenuItem value={'km'}>Khmer</MenuItem>
        <MenuItem value={'rw'}>Kinyarwanda</MenuItem>
        <MenuItem value={'ko'}>Korean</MenuItem>
        <MenuItem value={'ku'}>Kurdish (Kurmanji)</MenuItem>
        <MenuItem value={'ky'}>Kyrgyz</MenuItem>
        <MenuItem value={'lo'}>Lao</MenuItem>
        <MenuItem value={'la'}>Latin</MenuItem>
        <MenuItem value={'lv'}>Latvian</MenuItem>
        <MenuItem value={'lt'}>Lithuanian</MenuItem>
        <MenuItem value={'mg'}>Malagasy</MenuItem>
        <MenuItem value={'ms'}>Malay</MenuItem>
        <MenuItem value={'ml'}>Malayalam</MenuItem>
        <MenuItem value={'mt'}>Maltese</MenuItem>
        <MenuItem value={'mi'}>Maori</MenuItem>
        <MenuItem value={'mr'}>Marathi</MenuItem>
        <MenuItem value={'mn'}>Mongolian</MenuItem>
        <MenuItem value={'my'}>Myanmar (Burmese)</MenuItem>
        <MenuItem value={'ne'}>Nepali</MenuItem>
        <MenuItem value={'no'}>Norwegian</MenuItem>
        <MenuItem value={'or'}>Odia (Oriya)</MenuItem>
        <MenuItem value={'ps'}>Pashto</MenuItem>
        <MenuItem value={'fa'}>Persian</MenuItem>
        <MenuItem value={'pl'}>Polish</MenuItem>
        <MenuItem value={'pt'}>Portuguese</MenuItem>
        <MenuItem value={'pa'}>Punjabi</MenuItem>
        <MenuItem value={'ro'}>Romanian</MenuItem>
        <MenuItem value={'ru'}>Russian</MenuItem>
        <MenuItem value={'sm'}>Samoan</MenuItem>
        <MenuItem value={'gd'}>Scots Gaelic</MenuItem>
        <MenuItem value={'sr'}>Serbian</MenuItem>
        <MenuItem value={'st'}>Sesotho</MenuItem>
        <MenuItem value={'sn'}>Shona</MenuItem>
        <MenuItem value={'sd'}>Sindhi</MenuItem>
        <MenuItem value={'si'}>Sinhala</MenuItem>
        <MenuItem value={'sk'}>Slovak</MenuItem>
        <MenuItem value={'sl'}>Slovenian</MenuItem>
        <MenuItem value={'so'}>Somali</MenuItem>
        <MenuItem value={'es'}>Spanish</MenuItem>
        <MenuItem value={'su'}>Sundanese</MenuItem>
        <MenuItem value={'sw'}>Swahili</MenuItem>
        <MenuItem value={'sv'}>Swedish</MenuItem>
        <MenuItem value={'tg'}>Tajik</MenuItem>
        <MenuItem value={'ta'}>Tamil</MenuItem>
        <MenuItem value={'tt'}>Tatar</MenuItem>
        <MenuItem value={'te'}>Telugu</MenuItem>
        <MenuItem value={'th'}>Thai</MenuItem>
        <MenuItem value={'tr'}>Turkish</MenuItem>
        <MenuItem value={'tk'}>Turkmen</MenuItem>
        <MenuItem value={'uk'}>Ukrainian</MenuItem>
        <MenuItem value={'ur'}>Urdu</MenuItem>
        <MenuItem value={'ug'}>Uyghur</MenuItem>
        <MenuItem value={'uz'}>Uzbek</MenuItem>
        <MenuItem value={'vi'}>Vietnamese</MenuItem>
        <MenuItem value={'cy'}>Welsh</MenuItem>
        <MenuItem value={'xh'}>Xhosa</MenuItem>
        <MenuItem value={'yi'}>Yiddish</MenuItem>
        <MenuItem value={'yo'}>Yoruba</MenuItem>
        <MenuItem value={'zu'}>Zulu</MenuItem>
      </Select>
    </FormControl>


    <TransparentButton variant="contained" color="primary"  sx={{marginRight: -1.5}} onClick={changeLanguages}>
      <RiArrowLeftRightLine color="grey" size={30}/>
    </TransparentButton>

    <Box sx={{ minWidth: 120, marginLeft: 'auto', marginRight: 1.9 }}>
    <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={language2}
          onChange={handleChange2}
          name="languageTo"
        >
          <MenuItem value={'af'}>Afrikaans</MenuItem>
        <MenuItem value={'sq'}>Albanian</MenuItem>
        <MenuItem value={'am'}>Amharic</MenuItem>
        <MenuItem value={'ar'}>Arabic</MenuItem>
        <MenuItem value={'hy'}>Armenian</MenuItem>
        <MenuItem value={'az'}>Azerbaijani</MenuItem>
        <MenuItem value={'eu'}>Basque</MenuItem>
        <MenuItem value={'be'}>Belarusian</MenuItem>
        <MenuItem value={'bn'}>Bengali</MenuItem>
        <MenuItem value={'bs'}>Bosnian</MenuItem>
        <MenuItem value={'bg'}>Bulgarian</MenuItem>
        <MenuItem value={'ca'}>Catalan</MenuItem>
        <MenuItem value={'ceb'}>Cebuano</MenuItem>
        <MenuItem value={'ny'}>Chichewa</MenuItem>
        <MenuItem value={'zh-CN'}>Chinese (Simplified)</MenuItem>
        <MenuItem value={'zh-TW'}>Chinese (Traditional)</MenuItem>
        <MenuItem value={'co'}>Corsican</MenuItem>
        <MenuItem value={'hr'}>Croatian</MenuItem>
        <MenuItem value={'cs'}>Czech</MenuItem>
        <MenuItem value={'da'}>Danish</MenuItem>
        <MenuItem value={'nl'}>Dutch</MenuItem>
        <MenuItem value={'en'}>English</MenuItem>
        <MenuItem value={'eo'}>Esperanto</MenuItem>
        <MenuItem value={'et'}>Estonian</MenuItem>
        <MenuItem value={'tl'}>Filipino</MenuItem>
        <MenuItem value={'fi'}>Finnish</MenuItem>
        <MenuItem value={'fr'}>French</MenuItem>
        <MenuItem value={'fy'}>Frisian</MenuItem>
        <MenuItem value={'gl'}>Galician</MenuItem>
        <MenuItem value={'ka'}>Georgian</MenuItem>
        <MenuItem value={'de'}>German</MenuItem>
        <MenuItem value={'el'}>Greek</MenuItem>
        <MenuItem value={'gu'}>Gujarati</MenuItem>
        <MenuItem value={'ht'}>Haitian Creole</MenuItem>
        <MenuItem value={'ha'}>Hausa</MenuItem>
        <MenuItem value={'haw'}>Hawaiian</MenuItem>
        <MenuItem value={'iw'}>Hebrew</MenuItem>
        <MenuItem value={'hi'}>Hindi</MenuItem>
        <MenuItem value={'hmn'}>Hmong</MenuItem>
        <MenuItem value={'hu'}>Hungarian</MenuItem>
        <MenuItem value={'is'}>Icelandic</MenuItem>
        <MenuItem value={'ig'}>Igbo</MenuItem>
        <MenuItem value={'id'}>Indonesian</MenuItem>
        <MenuItem value={'ga'}>Irish</MenuItem>
        <MenuItem value={'it'}>Italian</MenuItem>
        <MenuItem value={'ja'}>Japanese</MenuItem>
        <MenuItem value={'jw'}>Javanese</MenuItem>
        <MenuItem value={'kn'}>Kannada</MenuItem>
        <MenuItem value={'kk'}>Kazakh</MenuItem>
        <MenuItem value={'km'}>Khmer</MenuItem>
        <MenuItem value={'rw'}>Kinyarwanda</MenuItem>
        <MenuItem value={'ko'}>Korean</MenuItem>
        <MenuItem value={'ku'}>Kurdish (Kurmanji)</MenuItem>
        <MenuItem value={'ky'}>Kyrgyz</MenuItem>
        <MenuItem value={'lo'}>Lao</MenuItem>
        <MenuItem value={'la'}>Latin</MenuItem>
        <MenuItem value={'lv'}>Latvian</MenuItem>
        <MenuItem value={'lt'}>Lithuanian</MenuItem>
        <MenuItem value={'mg'}>Malagasy</MenuItem>
        <MenuItem value={'ms'}>Malay</MenuItem>
        <MenuItem value={'ml'}>Malayalam</MenuItem>
        <MenuItem value={'mt'}>Maltese</MenuItem>
        <MenuItem value={'mi'}>Maori</MenuItem>
        <MenuItem value={'mr'}>Marathi</MenuItem>
        <MenuItem value={'mn'}>Mongolian</MenuItem>
        <MenuItem value={'my'}>Myanmar (Burmese)</MenuItem>
        <MenuItem value={'ne'}>Nepali</MenuItem>
        <MenuItem value={'no'}>Norwegian</MenuItem>
        <MenuItem value={'or'}>Odia (Oriya)</MenuItem>
        <MenuItem value={'ps'}>Pashto</MenuItem>
        <MenuItem value={'fa'}>Persian</MenuItem>
        <MenuItem value={'pl'}>Polish</MenuItem>
        <MenuItem value={'pt'}>Portuguese</MenuItem>
        <MenuItem value={'pa'}>Punjabi</MenuItem>
        <MenuItem value={'ro'}>Romanian</MenuItem>
        <MenuItem value={'ru'}>Russian</MenuItem>
        <MenuItem value={'sm'}>Samoan</MenuItem>
        <MenuItem value={'gd'}>Scots Gaelic</MenuItem>
        <MenuItem value={'sr'}>Serbian</MenuItem>
        <MenuItem value={'st'}>Sesotho</MenuItem>
        <MenuItem value={'sn'}>Shona</MenuItem>
        <MenuItem value={'sd'}>Sindhi</MenuItem>
        <MenuItem value={'si'}>Sinhala</MenuItem>
        <MenuItem value={'sk'}>Slovak</MenuItem>
        <MenuItem value={'sl'}>Slovenian</MenuItem>
        <MenuItem value={'so'}>Somali</MenuItem>
        <MenuItem value={'es'}>Spanish</MenuItem>
        <MenuItem value={'su'}>Sundanese</MenuItem>
        <MenuItem value={'sw'}>Swahili</MenuItem>
        <MenuItem value={'sv'}>Swedish</MenuItem>
        <MenuItem value={'tg'}>Tajik</MenuItem>
        <MenuItem value={'ta'}>Tamil</MenuItem>
        <MenuItem value={'tt'}>Tatar</MenuItem>
        <MenuItem value={'te'}>Telugu</MenuItem>
        <MenuItem value={'th'}>Thai</MenuItem>
        <MenuItem value={'tr'}>Turkish</MenuItem>
        <MenuItem value={'tk'}>Turkmen</MenuItem>
        <MenuItem value={'uk'}>Ukrainian</MenuItem>
        <MenuItem value={'ur'}>Urdu</MenuItem>
        <MenuItem value={'ug'}>Uyghur</MenuItem>
        <MenuItem value={'uz'}>Uzbek</MenuItem>
        <MenuItem value={'vi'}>Vietnamese</MenuItem>
        <MenuItem value={'cy'}>Welsh</MenuItem>
        <MenuItem value={'xh'}>Xhosa</MenuItem>
        <MenuItem value={'yi'}>Yiddish</MenuItem>
        <MenuItem value={'yo'}>Yoruba</MenuItem>
        <MenuItem value={'zu'}>Zulu</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </Box>
  <Box component="form" noValidate onChange={handleInputChange} sx={{ mt: 3 }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={6}>
        <TextField
          id="standard-basic"
          label="Enter Text"
          fullWidth
          value={originalText}
          variant="outlined"
          multiline
          rows={10}
          name="textTranslate"
        />
      </Grid>
      <Grid item xs={5.9} alignItems="center">
        <TextField
          id="filled-read-only-input"
          value={translatedText}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          variant="outlined"
          multiline
          rows={10}
        />
      </Grid>
      </Grid>
      </Box>
<Grid item xs={12} align="center" sx={{ marginLeft: 'auto', marginTop: 0 }} >
      <History updateTextFields={updateTextFields}></History>
      </Grid>
      <Grid item xs={12} align="center" sx={{ marginLeft: 218, marginTop: -4 }} >
        <Button variant="contained" color="primary" onClick={readText} >
          Read
        </Button>
      </Grid>


      <Grid component="form" item xs={12} align="center">
      <Input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleFileCheck}>
        Upload
      </Button>
      <Typography sx={{marginTop: '2vw'}}><h3>Your Uploaded Documents: </h3></Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2vw' }}>
      <Box component="span" sx={{ width:'25vw', p: 2, border: '2px solid #1976D2', borderRadius: '10px'  }}>
  <div style={{ height: '30vh', overflow: 'auto', scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
    <FileDialog loading={loading} setLoading = {setLoading}/>
  </div>
</Box>
</div>
      </Grid>
  </Box>
  );
}
