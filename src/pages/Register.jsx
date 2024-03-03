import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from '../api/axios';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useState} from 'react';
import video from './video.mp4'; // Import your video file
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import countries from "i18n-iso-countries";
import Autocomplete from '@mui/material/Autocomplete';


const theme = createTheme();
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
const countryOptions = Object.entries(countries.getNames("en")).map(([code, name]) => ({
  value: code,
  label: name
}));
export default function Register() {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [id, setId] = useState(0);


  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };


  const handleCountryChange = (event, value) => {
    setSelectedCountry(value);
  };
  

  const handleSubmit = (event) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email=data.get('email');
    const password=data.get('password');
    const passwordVerify=data.get('passwordVerify');
    let x=0;
    if (!selectedCountry) {
      setErrorMessage("Select your country!")      
      return
    }

    const country=selectedCountry.label;


    
    if (password==passwordVerify && validateEmail(email)){
      axios({method: 'POST', url: 'http://127.0.0.1:5000/register', data: {
      email: email,
      password: password,
      country: country
    },
    })
    .then((response) => {
      console.log(response.data);
    
      axios
        .post('http://127.0.0.1:5000/returnUID', {
          email: email,
        })
        .then((uidResponse) => {
         // console.log("CUCU", uidResponse.data);
          localStorage.setItem('userID', uidResponse.data['userID']);
         // console.log(localStorage.getItem('userID'));
    
          axios
            .post('http://127.0.0.1:5000/create_folder', {
              userID: uidResponse.data[0],
            })
            .then((createFolderResponse) => {
            //  console.log(createFolderResponse.data);
              window.location.href = "/";
            })
            .catch((createFolderError) => {
              console.error(createFolderError);
            });
        })
        .catch((returnUIDError) => {
          console.error(returnUIDError);
        });
    })
    .catch((registrationError) => {
      console.error(registrationError);
      //console.log(email, password);
      setErrorMessage('User already exists!');
    });
    }else if(password!=passwordVerify){
      setErrorMessage("Passwords don't match!")
    }else{
      setErrorMessage("Invalid email!")
    }
 
    

  };
  return (
    <div style={{ position: 'relative' }}>
    <video
      autoPlay
      loop
      muted
      style={{
        position: 'absolute',
        top: -100,
        left: 0,
        width: '100%',
        height: '107.9vh',
        zIndex: -1,
        objectFit: 'cover',
      }}
    >
      <source src={video} type="video/mp4" />
    </video>
    <ThemeProvider theme={theme}>

      {errorMessage && 
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 9999
          }}
        >
          <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="error" onClose={() => {setErrorMessage("")}} sx={{ p: '16px', m: '0px' }}> 
      <Typography sx={{ fontSize: '1.2rem' }}>
            {errorMessage}
          </Typography>
      </Alert>

    </Stack>
        </div>
      }
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)', // optional: adds a blur effect to the background
        padding: '24px',
        borderRadius: '8px',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>

                <Autocomplete
                disablePortal
                onChange={handleCountryChange}
                id="combo-box-demo"
                options={countryOptions}
                value={selectedCountry}
                sx={{ width: 350 }}
                renderInput={(params) => <TextField {...params} label="Country *" />}
                />
          </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
                </Grid>
          
                <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordVerify"
                  label="Confirm Password"
                  type="password"
                  id="passwordVerify"
                  autoComplete="new-password"
                /></Grid>

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>

  );
        }