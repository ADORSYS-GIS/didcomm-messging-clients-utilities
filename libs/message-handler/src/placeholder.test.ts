import { Message } from 'didcomm';
import { describe, test } from 'vitest';

describe('didcomm', () => {
  test('authentication example', async () => {
    const msg = new Message({
      id: '1234567890',
      typ: 'application/didcomm-plain+json',
      type: 'http://example.com/protocols/lets_do_lunch/1.0/proposal',
      from: 'ALICE_DID',
      to: ['BOB_DID'],
      created_time: 1516269022,
      expires_time: 1516385931,
      body: { messagespecificattribute: 'and its value' },
    });
    const val = new Message(msg.as_value());
    return val;
  });
});
