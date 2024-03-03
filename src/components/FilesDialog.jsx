import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import {TiDelete } from "react-icons/ti";
import { utils, write, writeFile } from 'xlsx';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';


function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs({loading, setLoading}) {
    const [translatedText, setTranslatedText] = useState(' ');
    const [originalText, setOriginalText] = useState(' ');
    const [language, setLanguage] = useState('auto');
    const [language2, setLanguage2] = useState(localStorage.getItem('country_code').toLowerCase());
    const [openDialogs, setOpenDialogs] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [text, setText] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [fileType, setFileType] = useState('');


  useEffect(() => {
    // Function to fetch file names
    if(loading === true){
    const fetchFileNames = async () => {
        axios({method: 'POST', url: 'http://127.0.0.1:5000/get_file_names', data: {
            UserID: localStorage.getItem('userID')
          },
          })
          .then((response) => {
            //console.log(response.data);
            if (response.data.length === 0) {
              setText(true);
              //console.log(text);
            } else {
              setText(false);
            }
            setFileNames(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
    };
    fetchFileNames();
    setLoading(false);
    // const interval = setInterval(() => {
    //     fetchFileNames();
    //   }, 1000);
    //   return () => clearInterval(interval);
  }
  },[loading]);


  const handleClickOpen = (index, FileName) => {
    setOpenDialogs((prevOpenDialogs) => [...prevOpenDialogs, index]);
    handleFileLoadOriginalOnly(FileName);
  };

  const handleClose = (index) => {
    setOpenDialogs((prevOpenDialogs) => prevOpenDialogs.filter((item) => item !== index));
    setFileContent('');
    setTranslatedFileContent('')
  };

  const handleTranslate = (fileName) => {
   // console.log(fileName);
  }


    const [fileContent, setFileContent] = useState('');
    const [translatedFileContent, setTranslatedFileContent] = useState('');

  
    const handleFileLoad = async (fileName) => {
        axios({method: 'POST', url: 'http://127.0.0.1:5000/get_file_content', data: {
      file_name: fileName,
      userID: localStorage.getItem('userID'),
      sourceLanguage: language2,
      targetLanguage: language,
      x: 1
    },
    })
    .then((response) => {
      
      
      setTranslatedFileContent(response.data.translated);
    })
    .catch((error) => {
     // console.error(error);
     // console.log(error.data)
    });
    };


    const handleFileLoadOriginalOnly = async (fileName) => {
      axios({method: 'POST', url: 'http://127.0.0.1:5000/get_file_content', data: {
    file_name: fileName,
    userID: localStorage.getItem('userID'),
    sourceLanguage: 'en',
    targetLanguage: 'auto',
    x: 0
  },
  })
  .then((response) => {
   // console.log(response.data.translated);
    setFileContent(response.data.original);
  })
  .catch((error) => {
   // console.error(error);
   // console.log(error.data)
  });
  };


  const handleSubmit = (event) => {
    // Here you can add your translation logic
    const data = new FormData(event.currentTarget);

    const translateText=data.get('textTranslate');
    setOriginalText(translateText);
    //console.log(language, language2);
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
      //console.log(error.data)
      setTranslatedText(error.data);
    });

  };

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleChange2 = (event) => {
    setLanguage2(event.target.value);
  };

  let isSpeaking = false; // declare a variable to keep track of whether audio is currently playing

  const synth = window.speechSynthesis;


  const readText=()=>{
    const text=translatedFileContent;
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
   // console.log(isSpeaking);

  } else {
    speechSynthesis.speak(utterance); // start playing the audio if it is not already playing
    isSpeaking = true; // set isSpeaking to true
    //console.log(isSpeaking);

  }
}

const downloadFile = (fileName, data) => {
  const fileExtension = fileName.split('.').pop();
  let contentType, downloadFileName;

 // console.log("Data", data);

  data=translatedFileContent;


  if (fileExtension === 'docx') {
    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    downloadFileName = 'translated.doc';
  } else if (fileExtension === 'xlsx') {
    downloadExcel(fileName);
    return 0;
  } else {
    contentType = 'text/plain';
    downloadFileName = 'translated.txt';
  }

  const blob = new Blob([data], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = downloadFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


const downloadExcel = async (fileName) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/get_file_content_excel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_name: fileName,
      userID: localStorage.getItem('userID'),
      sourceLanguage: language2,
      targetLanguage: language
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to download file.');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error:', error.message);
    // Handle error
  }
};


const handleConfirmDelete = (FileName) => {
  axios({method: 'POST', url: 'http://127.0.0.1:5000/delete_file', data: {
    file_name: FileName,
    userID: localStorage.getItem('userID'),
  },
  })
  .then((response) => {
    console.log(response.data.translated);
    setLoading(true);
  })
  .catch((error) => {
    console.error(error);
  });
  setOpen(false);
}

const [open, setOpen] = useState(false);
const [deleteFile, setDeleteFile] = useState('');

  const handleDeleteFile = (fileName) => {
    setOpen(true);
    setDeleteFile(fileName);
  };

  const handleCloseDelete = () => {
    setOpen(false);
  };


  return (
    <div>
       {text && <h3>No files uploaded yet!</h3>}
      {fileNames.map((fileName, index) => (
        <div key={index}>
          <Button variant="contained" onClick={() => handleClickOpen(index, fileName)} style={{ width: '10vw', marginTop: '0.5vw', marginRight: '0.5vw' }}>
            {fileName}
            
          </Button>
          <Button variant="outlined" onClick={() => handleDeleteFile(fileName)} startIcon={<TiDelete size={30} style={{ color: 'red' }} />} style={{marginTop: '0.5vw', marginLeft: '10px', height: '1.9vw'}}>
            Delete File
          </Button>

      <Dialog
  open={open}
  onClose={handleCloseDelete}
  PaperProps={{
  }}
  BackdropProps={{
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  }}
>
      <DialogTitle>
          Are you sure you want to delete&nbsp;
          <Typography component="span" style={{ color: 'blue' }}>
            {deleteFile}
          </Typography>
          ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={() => handleConfirmDelete(deleteFile)} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
          {openDialogs.includes(index) && (
          <Dialog
          onClose={() => handleClose(index)}
          aria-labelledby="customized-dialog-title"
          open={true}
          maxWidth="md" // Set the maxWidth to your desired value (e.g., 'md' for medium)
          //fullWidth // Enable fullWidth to expand the dialog to the maximum width
          PaperProps={{
            style: { minWidth: '50vw', overflowY: '1' }
          }}
        >

<BootstrapDialogTitle
  id="customized-dialog-title"
  onClose={() => handleClose(index)}
  style={{ fontWeight: 'bold', color: '#1976D2' }}
>
  {fileName}
</BootstrapDialogTitle>
              <Box sx={{ display: 'flex' }}>
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


    <Box sx={{ minWidth: 120, marginLeft: 'auto', marginRight: 0}}>
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
  <div style={{ display: 'flex', justifyContent: 'center' }}>
  <Button variant="contained" autoFocus onClick={() => handleFileLoad(fileName)} sx={{ width: '10vw' }}>
    Translate
  </Button>
</div>

                <div style={{ display: 'flex', marginTop: 30 }}>
  <div style={{ flex: 1, paddingLeft: '1rem', overflowY: 'auto' }}>
    <h2>Original File Contents:</h2>
    <pre style={{ whiteSpace: 'pre-wrap' }}>{fileContent}</pre>
  </div>
  <div style={{ width: 1, backgroundColor: '#000', margin: '0 1rem' }}></div>
  <div style={{ flex: 1, paddingRight: '1rem', overflowY: 'auto', textAlign: '' }}>
    <h2 style={{ marginRight: '1rem', textAlign: 'end'  }}>Translated File Contents:</h2>
  <pre style={{ whiteSpace: 'pre-wrap' }}>{translatedFileContent}</pre>


  </div>
</div>


              <DialogActions>
                <Button variant="contained" autoFocus onClick={() => readText()}>
                  Read
                </Button>
                <Button variant="contained" autoFocus onClick={() => downloadFile(fileName)}>
                  Download
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </div>
      ))}
    </div>
  );
}
