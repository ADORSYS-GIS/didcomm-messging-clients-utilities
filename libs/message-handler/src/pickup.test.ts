import { PICKUP_REQUEST_3_0 } from './constants/message-type';
import { FROM } from './did/client';
import { describe, test, expect } from 'vitest';
import { buildMessage, handleResponse, pack_encrypt } from './pickup';

const To =
  'did:peer:2.Vz6MkmPB3CCH5DBrtSi1MKXEcPXRFXSm7MVqEgsntoYwmtAWX.Ez6MkwH2RDGfBo89VA8EPP5pTRnfcV2Z8XyHCjyWiQjMQE3Si.SeyJ0IjoiZG0iLCJzIjp7InVyaSI6Imh0dHA6Ly9leGFtcGxlLmNvbS9kaWRjb21tIiwiYSI6WyJkaWRjb21tL3YyIl0sInIiOlsiZGlkOnBlZXI6Mi5WejZNa21QQjNDQ0g1REJydFNpMU1LWEVjUFhSRlhTbTdNVnFFZ3NudG9Zd210QVdYLkV6Nk1rd0gyUkRHZkJvODlWQThFUFA1cFRSbmZjVjJaOFh5SENqeVdpUWpNUUUzU2kja2V5LTEiXX19';

describe('didcomm', () => {
  test('test message packing and unpacking for pickup request', async () => {
    const msg = buildMessage(FROM, To, PICKUP_REQUEST_3_0);
    console.log(msg.as_value());
    const packmsg = await pack_encrypt(msg, FROM);
    console.log(packmsg);
    const unpacksg = await handleResponse(FROM, packmsg as string);
    console.log(unpacksg);
    expect(packmsg).not.toBeNull();
  });
});
