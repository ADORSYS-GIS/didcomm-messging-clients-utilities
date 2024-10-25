// mediation-coordination.test.ts
import { describe, expect, it, jest } from '@jest/globals';
import Mediation_Coordinaton, { build_and_pack_msg, keylist_query, keylist_update, mediate_request } from './mediation-coordination';
import { Message } from 'didcomm';

jest.mock('didcomm', () => ({
  Message: {
    pack_encrypted: jest.fn(),
    unpack: jest.fn(),
  },
}));

describe('Mediation_Coordinaton', () => {
  it('should return routing_did', async () => {
    const mediation_response = {
      as_value: () => ({
        body: {
          routing_did: 'routing_did',
        },
      }),
    };

    const mediate_request = jest.fn(() => Promise.resolve(mediation_response));
    const keylist_update = jest.fn();

    const result = await Mediation_Coordinaton(false, ['to'], 'recipient_did', 'action');
    expect(result).toBe('routing_did');
    expect(mediate_request).toHaveBeenCalledTimes(1);
    expect(keylist_update).toHaveBeenCalledTimes(1);
  });

  it('should throw error if mediation_response is invalid', async () => {
    const mediation_response = {
      as_value: () => ({
        body: {},
      }),
    };

    const mediate_request = jest.fn(() => Promise.resolve(mediation_response));

    await expect(Mediation_Coordinaton(false, ['to'], 'recipient_did', 'action')).rejects.toThrow(
      'Mediation Deny',
    );
    expect(mediate_request).toHaveBeenCalledTimes(1);
  });
});

describe('build_and_pack_msg', () => {
  it('should return packed message', async () => {
    const to = ['to'];
    const type = 'type';
    const body = {};

    const msg = new Message({
      id: 'id',
      typ: 'application/didcomm-plain+json',
      type: type,
      from: '',
      to: to,
      body: body,
    });

    const pack_encrypted = jest.fn(() => Promise.resolve(['packed_msg', {}]));

    const result = await build_and_pack_msg(to, type, body);
    expect(result).toBe('packed_msg');
    expect(pack_encrypted).toHaveBeenCalledTimes(1);
  });
});

describe('mediate_request', () => {
  it('should return mediation response', async () => {
    const to = ['to'];
    const recipient_did = 'recipient_did';

    const build_and_pack_msg = jest.fn(() => Promise.resolve('packed_msg'));
    const fetch = jest.fn(() => Promise.resolve({ text: () => 'response_text' }));
    const Message = {
      unpack: jest.fn(() => Promise.resolve(['unpacked_msg', {}])),
    };

    const result = await mediate_request(to, recipient_did);
    expect(result).toBe('unpacked_msg');
    expect(build_and_pack_msg).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(Message.unpack).toHaveBeenCalledTimes(1);
  });
});

describe('keylist_update', () => {
  it('should return updated keylist', async () => {
    const recipient_did = 'recipient_did';
    const action = 'action';
    const to = ['to'];

    const build_and_pack_msg = jest.fn(() => Promise.resolve('packed_msg'));
    const fetch = jest.fn(() => Promise.resolve({ text: () => 'response_text' }));
    const Message = {
      unpack: jest.fn(() => Promise.resolve(['unpacked_msg', {}])),
    };

    const result = await keylist_update(recipient_did, action, to);
    expect(result).toBe('unpacked_msg');
    expect(build_and_pack_msg).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(Message.unpack).toHaveBeenCalledTimes(1);
  });
});

describe('keylist_query', () => {
  it('should return keylist query response', async () => {
    const recipient_did = ['recipient_did'];
    const action = 'action';
    const did = 'did';

    const build_and_pack_msg = jest.fn(() => Promise.resolve('packed_msg'));
    const fetch = jest.fn(() => Promise.resolve({ text: () => 'response_text' }));
    const Message = {
      unpack: jest.fn(() => Promise.resolve(['unpacked_msg', {}])),
    };

    const result = await keylist_query(recipient_did, action, did);
    expect(result).toBe('unpacked_msg');
    expect(build_and_pack_msg).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(Message.unpack).toHaveBeenCalledTimes(1);
  });
});