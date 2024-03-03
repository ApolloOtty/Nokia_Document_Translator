import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dashboard from '../pages/Dashboard'
import axios from '../api/axios';
import { useEffect } from 'react';



export default function SwipeableTemporaryDrawer(props) {

    const [originalText, setOriginalText] = React.useState([]);
    const [translatedText, setTranslatedText] = React.useState([]);
    const [targetLanguage, setTargetLanguage] = React.useState([]);
    const [sourceLanguage, setSourceLanguage] = React.useState([]);
    const [data, setData] = React.useState([]);

    useEffect(() => {
        const fetchData = async () => {
        axios({
          method: 'POST',
          url: 'http://127.0.0.1:5000/returnHistory',
          data: { UserID: localStorage.getItem('userID') },
        })
          .then((response) => {
            //console.log(response.data);
            setData(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
        };
        const interval = setInterval(() => {
            fetchData();
          }, 5000);
          return () => clearInterval(interval);
      },[]);



  const [state, setState] = React.useState({
    bottom: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleClick = (row) => {
    const google_translate_languages = ['Language Detected Automatically',    'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani',    'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian', 'Catalan',    'Cebuano', 'Chichewa', 'Chinese (Simplified)', 'Chinese (Traditional)',    'Corsican', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Esperanto',    'Estonian', 'Filipino', 'Finnish', 'French', 'Frisian', 'Galician', 'Georgian',    'German', 'Greek', 'Gujarati', 'Haitian Creole', 'Hausa', 'Hawaiian', 'Hebrew',    'Hindi', 'Hmong', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian', 'Irish',    'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khmer', 'Kinyarwanda',    'Korean', 'Kurdish (Kurmanji)', 'Kyrgyz', 'Lao', 'Latin', 'Latvian', 'Lithuanian',    'Luxembourgish', 'Macedonian', 'Malagasy', 'Malay', 'Malayalam', 'Maltese',    'Maori', 'Marathi', 'Mongolian', 'Myanmar (Burmese)', 'Nepali', 'Norwegian',    'Odia (Oriya)', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian',    'Russian', 'Samoan', 'Scots Gaelic', 'Serbian', 'Sesotho', 'Shona', 'Sindhi',    'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese', 'Swahili',    'Swedish', 'Tajik', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Turkish', 'Turkmen',    'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek', 'Vietnamese', 'Welsh', 'Xhosa', 'Yiddish',    'Yoruba', 'Zulu']
    const language_codes = ['auto',
    'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs',
    'bg', 'ca', 'ceb', 'ny', 'zh-CN', 'zh-TW', 'co', 'hr', 'cs',
    'da', 'nl', 'en', 'eo', 'et', 'tl', 'fi', 'fr', 'fy', 'gl',
    'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn',
    'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk',
    'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb',
    'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne',
    'no', 'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm',
    'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es',
    'su', 'sw', 'sv', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'tk',
    'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu']
    const sourceLanguageIndex = google_translate_languages.indexOf(row[2]);
    const targetLanguageIndex = google_translate_languages.indexOf(row[3]);
  
    const sourceLanguageCode = language_codes[sourceLanguageIndex];
    const targetLanguageCode = language_codes[targetLanguageIndex];
    props.updateTextFields(row[0], row[1], sourceLanguageCode, targetLanguageCode);
  };

  const list = (anchor) => (
    <Box
    sx={{
      width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
      maxHeight: '400px',
      overflow: 'auto',
    }}
    role="presentation"
    onClick={toggleDrawer(anchor, false)}
    onKeyDown={toggleDrawer(anchor, false)}
  >
      <Table>
        <TableHead>
            <TableRow>
            <TableCell>Original Text</TableCell>
            <TableCell>Translated Text</TableCell>
            <TableCell>Source Language</TableCell>
            <TableCell>Target Language</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {data.map((row, index) => (
            <TableRow
                key={index}
                onClick={() => handleClick(row)}
            >
                <TableCell>{row[0]}</TableCell>
                <TableCell>{row[1]}</TableCell>
                <TableCell>{row[2]}</TableCell>
                <TableCell>{row[3]}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </Box>
  );

  return (
    <div>
        
      {['bottom'].map((anchor) => (
        <React.Fragment key={anchor}>
        
          <Button variant='contained' onClick={toggleDrawer(anchor, true)}>History</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
