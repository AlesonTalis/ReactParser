import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ReactParser from './react-parser';
import TextEditor from '../../component/TextEditor';

// Example input
const example = `Screen
  Section row()
    Text value("Hello world!") align(center).flex padding(5,10).rem
  Section id(body) flex(row).align(start)
    FillLoren paragraph(2)`;

// Create a Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

// Main App component
export default function Claude() {
  const parser = new ReactParser();
//   const parsedComponents = parser.parse(example);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TextEditor childrenElement={(text) => parser.parse(text)} />
    </ThemeProvider>
  );
}