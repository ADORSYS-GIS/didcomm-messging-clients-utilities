import React, { useState } from 'react';
import {
  pickupRequest,
  pickupDelivery,
  pickupReceive,
} from '../../../src/pickup';
import { Message } from 'didcomm';

export default function DidCommUI() {
  const [to, setTo] = useState('');
  const [recipientDid, setRecipientDid] = useState('');
  const [messageType, setMessageType] = useState('Pickup Request');
  const [response, setResponse] = useState<Message | null>(null);
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
          result = await pickupDelivery(to, recipientDid);
          break;
        case 'Pickup Receive':
          result = await pickupReceive(to, recipientDid);
          break;
        default:
          throw new Error('Invalid message type selected');
      }
      setResponse(result);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <h1 className="text-xl font-bold text-gray-800">
        DIDComm Message pickup
      </h1>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Recipient's DID"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recipient DID
          </label>
          <input
            type="text"
            value={recipientDid}
            onChange={(e) => setRecipientDid(e.target.value)}
            placeholder="Recipient's DID"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message Type
          </label>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Pickup Request</option>
            <option>Pickup Delivery</option>
            <option>Pickup Receive</option>
          </select>
        </div>
        <button
          onClick={handleSend}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">Response</h2>
          <pre className="text-sm text-gray-700 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
