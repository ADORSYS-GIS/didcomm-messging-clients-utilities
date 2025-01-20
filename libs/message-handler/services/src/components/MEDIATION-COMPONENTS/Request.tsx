import React, { useState } from 'react';
import './request.css';

const MediateRequestUI: React.FC = () => {
  const [mediatorDid, setMediatorDid] = useState('');
  const [recipientDid, setRecipientDid] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMediateRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const body = { mediatorDid, recipientDid };
      const res = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/didcomm-encrypted+json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        // throw new Error(`Request failed: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mediate-request-ui">
      <h1>Mediation Request</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleMediateRequest();
        }}
      >
        <div className="form-group">
          <label htmlFor="mediatorDid">Mediator DID:</label>
          <input
            type="text"
            id="mediatorDid"
            value={mediatorDid}
            onChange={(e) => setMediatorDid(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="recipientDid">Recipient DID:</label>
          <input
            type="text"
            id="recipientDid"
            value={recipientDid}
            onChange={(e) => setRecipientDid(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Send Mediation Request'}
        </button>
      </form>
      {error && <p className="error">Error: {error}</p>}
      {response && (
        <div className="response">
          <h2>Response:</h2>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default MediateRequestUI;
