import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { PickupClient }from './pickup';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Message } from 'didcomm';

jest.mock('didcomm', () => ({
  Message: jest.fn().mockImplementation(() => ({
    pack_encrypted: jest.fn(),
    unpack: jest.fn(),
  })),
}));

describe('PickupClient', () => {
  let mockAdapter: jest.fn();
  let pickupClient: PickupClient;

  beforeEach(() => {
    mockAdapter = new MockAdapter(axios);
    pickupClient = new PickupClient('did:example:recipient', ['message-id-1'], 'https://example.com/mediation-endpoint');
  });

  afterEach(() => {
    mockAdapter.restore();
  });

  it('should send a pickup request', async () => {
    const mockResponse = { success: true };
    mockAdapter.onPost('https://example.com/mediation-endpoint').reply(200, mockResponse);

    await pickupClient.sendPickupRequest();

    const history = mockAdapter.history.post;
    expect(history).toBeDefined();
    expect(history.length).toBe(1);
    expect(history[0].data).toContain('did:example:recipient');
  });

  it('should send a pickup delivery request', async () => {
    const mockResponse = { success: true };
    mockAdapter.onPost('https://example.com/mediation-endpoint').reply(200, mockResponse);

    await pickupClient.sendPickupDeliveryRequest();

    const history = mockAdapter.history.post;
    expect(history).toBeDefined();
    expect(history.length).toBe(1);
    expect(history[0].data).toContain('did:example:recipient');
  });

  it('should send a pickup message received', async () => {
    const mockResponse = { success: true };
    mockAdapter.onPost('https://example.com/mediation-endpoint').reply(200, mockResponse);

    await pickupClient.sendPickupMessageReceived();

    const history = mockAdapter.history.post;
    expect(history).toBeDefined();
    expect(history.length).toBe(1);
    expect(history[0].data).toContain('did:example:recipient');
  });

  it('should handle unpack response', async () => {
    const mockResponse = { success: true };
    mockAdapter.onPost('https://example.com/mediation-endpoint').reply(200, mockResponse);

    const packedMsg = 'packed message';
    const unpackedMsg = await pickupClient.handleUnpackResponse(packedMsg);

    expect(unpackedMsg).toBeDefined();
  });

  it('should throw error during unpacking response', async () => {
    const mockResponse = { success: true };
    mockAdapter.onPost('https://example.com/mediation-endpoint').reply(200, mockResponse);

    const packedMsg = 'packed message';
    jest.spyOn(Message, 'unpack').mockRejectedValueOnce(new Error('unpacking error'));

    await expect(pickupClient.handleUnpackResponse(packedMsg)).rejects.toThrowError('unpacking error');
  });
});