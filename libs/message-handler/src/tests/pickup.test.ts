// Import necessary constants and functions from other modules// Import necessary modules and constants
import { describe, expect, test } from 'vitest';
import { buildMessage, pack_encrypt, handleResponse } from '../pickup';
import { PICKUP_REQUEST_3_0 } from '../protocols/message_types';
import { FROM } from '../shared_data/constants';

const To =
  'did:peer:2.Vz6MkmPB3CCH5DBrtSi1MKXEcPXRFXSm7MVqEgsntoYwmtAWX.Ez6MkwH2RDGfBo89VA8EPP5pTRnfcV2Z8XyHCjyWiQjMQE3Si.SeyJ0IjoiZG0iLCJzIjp7InVyaSI6Imh0dHA6Ly9leGFtcGxlLmNvbS9kaWRjb21tIiwiYSI6WyJkaWRjb21tL3YyIl0sInIiOlsiZGlkOnBlZXI6Mi5WejZNa21QQjNDQ0g1REJydFNpMU1LWEVjUFhSRlhTbTdNVnFFZ3NudG9Zd210QVdYLkV6Nk1rd0gyUkRHZkJvODlWQThFUFA1cFRSbmZjVjJaOFh5SENqeVdpUWpNUUUzU2kja2V5LTEiXX19';

describe('didcomm', () => {
  test('build, pack, and unpack message for pickup request', async () => {
    const buildmsg = buildMessage(FROM, To, PICKUP_REQUEST_3_0);
    const packmsg = await pack_encrypt(buildmsg, FROM);
    const unpackmsg = await handleResponse(FROM, packmsg as string);

    expect(packmsg).not.toBeNull();
    expect(unpackmsg?.as_value()).toEqual(buildmsg.as_value());
  });
});
