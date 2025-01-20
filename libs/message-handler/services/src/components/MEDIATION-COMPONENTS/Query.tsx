import React, { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { keylistQuery } from './../../../../src/mediation-coordination';
import { Message } from 'didcomm';

const KeylistQueryUI = () => {
  const [recipientDid, setRecipientDid] = useState('');
  const [mediatorDid, setMediatorDid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleKeylistQuery = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await keylistQuery(mediatorDid, [recipientDid]);
      setResult(response);
    } catch (err: any) {
      setError('Error executing keylist query: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Keylist Query
      </Typography>

      <TextField
        label="Recipient DID"
        fullWidth
        value={recipientDid}
        onChange={(e) => setRecipientDid(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Mediator DID"
        fullWidth
        value={mediatorDid}
        onChange={(e) => setMediatorDid(e.target.value)}
        margin="normal"
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleKeylistQuery}
        disabled={isLoading}
        sx={{ marginTop: 2 }}
      >
        Execute Query
      </Button>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {result && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Query Result:</Typography>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Box>
      )}

      {error && (
        <Box sx={{ marginTop: 2, color: 'red' }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default KeylistQueryUI;
