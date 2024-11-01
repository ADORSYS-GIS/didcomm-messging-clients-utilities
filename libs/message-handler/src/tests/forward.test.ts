import { forward_msg } from '../protocols/forward-client';
import { describe, expect, jest, test } from '@jest/globals';
import { Message } from 'didcomm';

jest.mock('didcomm', () => ({
  Message: jest.fn().mockImplementation(() => ({
    // Correctly mock the return value with explicit type
    pack_encrypted: jest.fn(), 
    unpack: jest.fn(),
  })),
}));

jest.mock('axios');
import axios from 'axios';
const mockedaxios = axios as jest.Mocked<typeof axios>;

describe('Forward Client Tests', () => {
  test('should forward a message successfully', async () => {
    const to = ["did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0"];
    const message = "Hello blessing chendi";

    mockedaxios.post.mockResolvedValue({ status: 200 });
    const result = await forward_msg(to, {}, message);
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

  });
});
