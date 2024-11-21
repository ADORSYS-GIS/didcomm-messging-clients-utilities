import { describe, expect, test } from 'vitest';
import { buildMessage, pack_encrypt } from '../protocols/forward-client';

describe('Forward Client Tests', () => {
  test('should forward a message successfully', async () => {
    const to = [
      'did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0',
    ];
    const message = 'Hello is a test message to forward';
    const msg = buildMessage(to, message);
    const packmsg = pack_encrypt(msg, to);
    expect(packmsg).not.toBeNull();
  });
  test('should handle wrong DID and throw an error', async () => {
    const to = [
      'did:peer:3.InvalidDIDExample.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0',
    ];
    const message = 'This should fail due to an invalid DID';

    const msg = buildMessage(to, message);

    await expect(pack_encrypt(msg, to)).rejects.toThrowError();
  });
});
