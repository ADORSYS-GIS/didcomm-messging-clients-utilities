import { FROM } from './did/client';
import { describe, test, expect } from 'vitest';
import {
  sendPickupRequest,
  sendPickupDeliveryRequest,
  buildPickupMessageReceivedMessage,
  sendPickupMessageReceived,
  handleUnpackResponse,
} from './pickup';

const SERVICE_ENDPOINT = 'http://localhost:3000';

describe('test pickup request', async () => {
  test('test pickup request', async () => {
    const to = FROM;
    const recipient_did = FROM;
    const result = await sendPickupRequest(to, recipient_did);
    expect(result).not.toBeNull();
  });
  test('test pickup delivery request', async () => {
    const to = FROM;
    const recipientDid = FROM;
    const result = await sendPickupDeliveryRequest(to, recipientDid);
    expect(result).not.toBeNull();
  });
  test('test build pickup message received message', async () => {
    const recipientDid = FROM;
    const messageIds = ['message-id-1', 'message-id-2'];
    const result = await buildPickupMessageReceivedMessage(
      recipientDid,
      messageIds,
    );
    expect(result).not.toBeNull();
  });

  test('test send pickup message received', async () => {
    const to = FROM;
    const recipientDid = FROM;
    const messageIds = ['message-id-1', 'message-id-2'];
    const result = await sendPickupMessageReceived(
      to,
      recipientDid,
      messageIds,
      SERVICE_ENDPOINT,
    );
    expect(result).not.toBeNull();
  });

  test('test handle unpack response', async () => {
    const to = FROM;
    const packedMsg = 'packed-message';
    const result = await handleUnpackResponse(to, packedMsg);
    expect(result).not.toBeNull();
  });
});
