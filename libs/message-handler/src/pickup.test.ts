import { FROM } from './did/client';
import { describe, test, expect, vi } from 'vitest';
import {
  sendPickupRequest,
  sendPickupDeliveryRequest,
  buildPickupMessageReceivedMessage,
  sendPickupMessageReceived,
  handleUnpackResponse,
} from './pickup';


const SERVICE_ENDPOINT = 'http://localhost:3000';


describe('test pickup request', () => {
  test('test pickup request', async () => {
    const to = FROM;
    const recipient_did = FROM;
    try {
      const result = await sendPickupRequest(to, recipient_did);
      expect(result).not.toBeNull();
    } catch (error) {
      console.error('Error during pickup request:', error);
      expect(error).toBeInstanceOf(Error);
    }
  });


  test('test pickup delivery request', async () => {
    const to = FROM;
    const recipientDid = FROM;
    try {
      const result = await sendPickupDeliveryRequest(to, recipientDid);
      expect(result).not.toBeNull();
    } catch (error) {
      console.error(error);
      expect(error).toBeInstanceOf(Error);
    }
  });


  test('test build pickup message received message', async () => {
    const recipientDid = FROM;
    const messageIds = ['message-id-1', 'message-id-2'];
    try {
      const result = await buildPickupMessageReceivedMessage(
        recipientDid,
        messageIds,
      );
      expect(result).not.toBeNull();
    } catch (error) {
      console.error('Error building pickup message received:', error);
      expect(error).toBeInstanceOf(Error);
    }
  });


  test('test send pickup message received', async () => {
    const to = FROM;
    const recipientDid = FROM;
    const messageIds = ['message-id-1', 'message-id-2'];


    // Mock the axios call
    vi.mock('axios', () => ({
      __esModule: true,
      default: {
        post: vi.fn(() => Promise.resolve({ data: {} })),
      },
    }));
  
    try {
      const result = await sendPickupMessageReceived(
        to,
        recipientDid,
        messageIds,
        SERVICE_ENDPOINT,
      );
      expect(result).not.toBeNull();
    } catch (error) {
      console.error('Error during send pickup message received:', error);
      expect(error).toBeInstanceOf(Error);
    }
  })


  test('test handle unpack response', async () => {
    const to = FROM;
    const packedMsg = 'packed-message';
    try {
      const result = await handleUnpackResponse(to, packedMsg);
      expect(result).not.toBeNull();
    } catch (error) {
      console.error('Error during unpack response:', error);
      expect(error).toBeInstanceOf(Error);
    }
  });
});