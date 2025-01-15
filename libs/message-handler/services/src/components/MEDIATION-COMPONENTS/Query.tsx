import React, { useState } from 'react';
import './App.css';

import   mediationCoordination, {
  keylistQuery,
} from '../../../../src/mediation-coordination'; 
const QueryComponent: React.FC = () => {
  const [mediatorDid, setMediatorDid] = useState('');
  const [recipientDid, setRecipientDid] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to handle mediation coordination
  const handleMediationCoordination = async () => {
    setError(null);
    setResponse(null);
    try {
      const routingDid = await mediationCoordination(mediatorDid, recipientDid);
      setResponse(`Routing DID: ${routingDid}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Function to handle keylist query
  const handleKeylistQuery = async () => {
    setError(null);
    setResponse(null);
    try {
      const result = await keylistQuery(mediatorDid, [recipientDid]);
      setResponse(`Keylist Query Response: ${JSON.stringify(result)}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="App">
      <h1>DIDComm Coordination</h1>
      <div className="form">
        <div className="form-group">
          <label>Mediator DID</label>
          <input
            type="text"
            value={mediatorDid}
            onChange={(e) => setMediatorDid(e.target.value)}
            placeholder="Enter Mediator DID"
          />
        </div>
        <div className="form-group">
          <label>Recipient DID</label>
          <input
            type="text"
            value={recipientDid}
            onChange={(e) => setRecipientDid(e.target.value)}
            placeholder="Enter Recipient DID"
          />
        </div>
        <div className="actions">
          <button onClick={handleMediationCoordination}>
            Start Mediation Coordination
          </button>
          <button onClick={handleKeylistQuery}>Query Keylist</button>
        </div>
        {response && <div className="response success">{response}</div>}
        {error && <div className="response error">{error}</div>}
      </div>
    </div>
  );
};

export default QueryComponent;


