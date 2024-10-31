import { forward_msg } from '../../message-handler/src/forward-client';
import { describe, expect, jest, test } from '@jest/globals';

jest.mock('didcomm', () => ({
  Message: jest.fn().mockImplementation(() => ({
    pack_encrypted: jest.fn(),
  })),
}));

jest.mock('axios');
const axios = require('axios');

describe('Forward Client Tests', () => {
  test('should forward a message successfully', async () => {
    const message = {
      to: ['did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b'],
      content: {
        text: 'Hello, this is a test message!',
      },
    };

    const body = {
      content: message.content,
    };

    axios.post.mockResolvedValue({ status: 200 });
    const result = await forward_msg(message.to, body);
    console.log('Result for valid message:', result);
    expect(result).toBe('Messages sent to recipient');
  });

  test('should handle forwarding to invalid DID', async () => {
    const invalidMessage = {
      to: ['did:peer:INVALID'],
      content: {
        text: 'This should fail!',
      },
    };

    const body = {
      content: invalidMessage.content,
    };

    //await expect(forward_msg(invalidMessage.to, body)).rejects.toThrow('Invalid DID');
  });
});
