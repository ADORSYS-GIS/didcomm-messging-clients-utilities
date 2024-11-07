import { describe, expect, test } from 'vitest';
import { forward_msg } from '../protocols/forward-client';

describe('Forward Client Tests', () => {
  test('should forward a message successfully', async () => {
    const to = ["did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0"];
    const message = "Hello blessing chendi";
    const result = await forward_msg(to, {}, message);
    console.log('Result for valid message:', result);

    expect(result).toBe('Messages sent to recipient');
  });
});
