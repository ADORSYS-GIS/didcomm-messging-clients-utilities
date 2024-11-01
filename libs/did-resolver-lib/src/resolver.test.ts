import { describe, expect, test } from '@jest/globals';
import PeerDIDResolver from './resolver';

const DIDDoc = {
  id: 'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
  keyAgreement: [
    'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0-#key-1',
  ],
  authentication: [
    'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0-#key-2',
  ],
  verificationMethod: [
    {
      id: 'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0-#key-1',
      type: 'X25519KeyAgreementKey2020',
      controller:
        'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
      publicKeyMultibase: 'z6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b',
    },
    {
      id: 'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0-#key-2',
      type: 'Ed25519VerificationKey2020',
      controller:
        'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
      publicKeyMultibase: 'z6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc',
    },
  ],
  service: [
    {
      id: '#didcomm',
      type: 'DIDCommMessaging',
      serviceEndpoint: 'http://alice-mediator.com',
    },
  ],
};

describe('resolver test', () => {
  test('test did peer resolver', async () => {
    const EX_DIDDOC = new PeerDIDResolver().resolve(
      'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
    );

    expect(await EX_DIDDOC).toEqual(DIDDoc);
  });
});

describe('negative resolver test', () => {
  test('negative did peer resolver test', async () => {
    const EX_DIDDOC = new PeerDIDResolver().resolve(
      'did:peer:4.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
    );

    expect(await EX_DIDDOC).toThrowError();
  });
});
