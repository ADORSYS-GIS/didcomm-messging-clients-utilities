import React, { useState } from 'react';
import {
  pickupRequest,
  pickupDelivery,
  pickupReceive,
} from '../../../src/pickup';
import './pickup.css';
import { IMessage } from 'didcomm';

export default function DidCommUI() {
  const [to, setTo] = useState('');
  const [recipientDid, setRecipientDid] = useState('');
  const [messageType, setMessageType] = useState('Pickup Request');
  const [response, setResponse] = useState<IMessage | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);

    try {
      let result;
      switch (messageType) {
        case 'Pickup Request':
          result = await pickupRequest(to, recipientDid);
          break;
        case 'Pickup Delivery':
          result = await pickupDelivery(to, recipientDid, 10);
          break;
        case 'Pickup Receive':
          result = await pickupReceive(to, recipientDid, [
            '6689601fd2d92bb3cd451b2c',
            '6389601fd2d92bb3cd451b2d',
          ]);
          break;
        default:
          throw new Error('Invalid message type selected');
      }
      setResponse(result.as_value());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">DIDComm Message Pickup</h1>

        <div className="space-y-4 mt-4">
          {/* Recipient DID */}
          <div>
            <label className="label">To</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Enter recipient's DID"
              className="input"
            />
          </div>

          {/* Sender DID */}
          <div>
            <label className="label">Recipient DID</label>
            <input
              type="text"
              value={recipientDid}
              onChange={(e) => setRecipientDid(e.target.value)}
              placeholder="Enter sender's DID"
              className="input"
            />
          </div>

          {/* Message Type Selection */}
          <div>
            <label className="label">Message Type</label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="select"
            >
              <option>Pickup Request</option>
              <option>Pickup Delivery</option>
              <option>Pickup Receive</option>
            </select>
          </div>

          {/* Send Button */}
          <button onClick={handleSend} className="button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </div>

        {/* Response Box */}
        {response && (
          <div className="response-box">
            <h2 className="response-title">Response</h2>
            <pre className="response-text">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
