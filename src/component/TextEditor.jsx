/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import {
  Button,
  TextField,
  Box,
  Typography,
  Alert
} from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error">
          Erro no componente filho: {this.state.error.message}
        </Alert>
      );
    }

    return this.props.children;
  }
}

const TextEditor = ({ childrenElement }) => {
  const [text, setText] = useState('');
  const [confirmedText, setConfirmedText] = useState(null);

  const handleConfirm = () => {
    setConfirmedText(text);
  };

  return (
    <Box sx={{ maxWidth: 600, m: 1 }}>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        rows={8}
        fullWidth
        placeholder="Digite seu texto..."
      />
      
      <Button 
        variant="contained" 
        onClick={handleConfirm}
        sx={{ mt: 2 }}
      >
        Confirmar
      </Button>

      {confirmedText && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Preview:
          </Typography>
          <ErrorBoundary>
            {childrenElement(confirmedText)}
          </ErrorBoundary>
        </Box>
      )}
    </Box>
  );
};


export default TextEditor;