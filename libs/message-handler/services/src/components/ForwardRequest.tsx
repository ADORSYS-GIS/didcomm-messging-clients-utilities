import React, { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { forward_msg } from './../../../src/protocols/forward-client';

const ForwardMessageUI = () => {
  const [mediator_did, setMediatorDID] = useState('');
  const [message, setMessage] = useState('');
  const [recipient_did, setRecipientDid] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await forward_msg([mediator_did],[recipient_did], message);
      setResponse(result);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Forward DIDComm Message
      </Typography>

      <Typography variant="body2" gutterBottom>
        Enter the recipient's DID and your message below.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Mediator DID"
          fullWidth
          value={mediator_did}
          onChange={(e) => setMediatorDID(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          label="Recipient DID"
          fullWidth
          value={recipient_did}
          onChange={(e) => setRecipientDid(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {response && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Response:</Typography>
          <Typography
            sx={{
              backgroundColor: '#e8f5e9',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #c8e6c9',
              color: '#388e3c',
            }}
          >
            {response}
          </Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ marginTop: 2 }}>
          <Typography
            sx={{
              backgroundColor: '#ffebee',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ffcdd2',
              color: '#d32f2f',
            }}
          >
            {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ForwardMessageUI;
