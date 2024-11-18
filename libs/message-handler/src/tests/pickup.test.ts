// Import necessary constants and functions from other modules
import { PICKUP_REQUEST_3_0 } from '../protocols/message_types';
import { FROM } from '../shared_data/constants';
import { describe, test, expect } from 'vitest';
import { buildMessage, handleResponse, pack_encrypt } from '../pickup';

const To =
  'did:peer:2.Vz6MkmPB3CCH5DBrtSi1MKXEcPXRFXSm7MVqEgsntoYwmtAWX.Ez6MkwH2RDGfBo89VA8EPP5pTRnfcV2Z8XyHCjyWiQjMQE3Si.SeyJ0IjoiZG0iLCJzIjp7InVyaSI6Imh0dHA6Ly9leGFtcGxlLmNvbS9kaWRjb21tIiwiYSI6WyJkaWRjb21tL3YyIl0sInIiOlsiZGlkOnBlZXI6Mi5WejZNa21QQjNDQ0g1REJydFNpMU1LWEVjUFhSRlhTbTdNVnFFZ3NudG9Zd210QVdYLkV6Nk1rd0gyUkRHZkJvODlWQThFUFA1cFRSbmZjVjJaOFh5SENqeVdpUWpNUUUzU2kja2V5LTEiXX19';

describe('didcomm', () => {
  test('test message packing and unpacking for pickup request', async () => {
    const msg = buildMessage(FROM, To, PICKUP_REQUEST_3_0);
    expect(msg).not.toBeNull();
    expect(msg.as_value()).toBeDefined();

    const packmsg = await pack_encrypt(msg, FROM);
    expect(packmsg).not.toBeNull();

    const unpacksg = await handleResponse(FROM, packmsg as string);
    console.log(unpacksg); // Log to inspect the structure of unpacksg

    // Temporary test on unpacksg structure
    expect(unpacksg).toBeDefined();
  });
});
