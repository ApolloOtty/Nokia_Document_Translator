import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from '../api/axios.js';
import { useRef, useState, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import video from './video.mp4'; // Import your video file
import nokia from './Nokia.png';

const theme = createTheme();

export default function SignInSide() { 
  const [errorMessage, setErrorMessage] = useState("");
  const[success, setSuccess] = useState(false);
  const handleSubmit = (event) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email=data.get('email');
    const password=data.get('password');
    //console.log(username, password);
    axios({method: 'POST', url: 'http://127.0.0.1:5000/login', data: {
      email: email,
      password: password
    },
    })
    .then((response) => {
     // console.log(response.data);
      setSuccess(true);
    })
    .catch((error) => {
    //  console.error(error);
    //  console.log(email, password);
      setErrorMessage("Username or password is incorrect");
    });

    axios({method: 'POST', url: 'http://127.0.0.1:5000/returnUID', data: {
      email: email
    },
    })
    .then((response) => {
     // console.log(response.data);
      localStorage.setItem('country_code', response.data['country_code']);
     // console.log(response.data['country_code']);
     // console.log(localStorage.getItem('country_code'))
    
      localStorage.setItem('userID', response.data['userID']);
     // console.log(localStorage.getItem('userID'))
    })
    .catch((error) => {
    //  console.error(error);
    });

  };

  return (
    <>
    {success ? (
        <section>
            <meta http-equiv="refresh" content="0; url=/dashboard" />
        </section>
    ) : (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
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
        <CssBaseline />
        <Grid
  item
  xs={false}
  sm={4}
  md={7}
  sx={{
    position: 'relative',
    backgroundColor: (t) =>
      t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
  }}
>
  
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }}
  >  <img src={nokia} alt="Italian Trulli"
      style={{
        position: 'absolute',
        left: 0,
        width: '45vw',
        top: '18vw',
        left: '6.5vw',
        zIndex: 2
      }}/>

    <video
      autoPlay
      loop
      muted
      style={{
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '107.9vh',
        objectFit: 'cover',
      }}
    >
      <source src={video} type="video/mp4" />
    </video>

    

  </div>
</Grid>

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    )}
    </>
  );
}