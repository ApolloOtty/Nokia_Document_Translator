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
import GlobalCountryChart from '../components/GlobalCountryChart'

export default function TwoTextBoxes() {


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
        
        <Button variant='contained' sx={{ marginBottom: 10 }} href="/profile">
        <Typography variant="h7" component="h2" sx={{ marginTop: 0 }}>
            Go to personal statistics
        </Typography>
    </Button>

        <Typography variant="h7" component="h2" sx={{ marginTop: 0 }}>
      Global statistics: 
    </Typography>
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
            <DonutGlobalFrom />
          </Grid>
          <Grid item mx={15} sx={{background: 'lightgrey', borderRadius: '10px'}}>
            <DonutGlobalTo />
          </Grid>

          

        </Box>
        <Grid item mx={15} sx={{background: 'lightgrey', borderRadius: '10px', width: '65vw', marginTop: '2vw'}}>
            <GlobalCountryChart />
          </Grid>
        
      </Box>
    </>
  );

        }