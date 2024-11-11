// Import necessary constants and functions from other modules
import { PICKUP_REQUEST_3_0 } from './constants/message-type'; // Import the pickup request message type constant
import { FROM } from './did/client'; // Import the sender's DID (Decentralized Identifier)
import { describe, test, expect } from 'vitest'; // Import testing framework functions
import { buildMessage, handleResponse, pack_encrypt } from './pickup'; // Import functions for building, packing, and handling messages

// Define the recipient's DID
const To =
  'did:peer:2.Vz6MkmPB3CCH5DBrtSi1MKXEcPXRFXSm7MVqEgsntoYwmtAWX.Ez6MkwH2RDGfBo89VA8EPP5pTRnfcV2Z8XyHCjyWiQjMQE3Si.SeyJ0IjoiZG0iLCJzIjp7InVyaSI6Imh0dHA6Ly9leGFtcGxlLmNvbS9kaWRjb21tIiwiYSI6WyJkaWRjb21tL3YyIl0sInIiOlsiZGlkOnBlZXI6Mi5WejZNa21QQjNDQ0g1REJydFNpMU1LWEVjUFhSRlhTbTdNVnFFZ3NudG9Zd210QVdYLkV6Nk1rd0gyUkRHZkJvODlWQThFUFA1cFRSbmZjVjJaOFh5SENqeVdpUWpNUUUzU2kja2V5LTEiXX19';

// Describe a test suite for DIDComm (Decentralized Identifier Communication)
describe('didcomm', () => {
  // Define a test case for packing and unpacking a pickup request message
  test('test message packing and unpacking for pickup request', async () => {
    // Build a pickup request message from the sender's DID to the recipient's DID
    const msg = buildMessage(FROM, To, PICKUP_REQUEST_3_0);
    console.log(msg.as_value()); // Log the message value for debugging

    // Pack and encrypt the message
    const packmsg = await pack_encrypt(msg, FROM);
    console.log(packmsg); // Log the packed message for debugging

    // Unpack and handle the response
    const unpacksg = await handleResponse(FROM, packmsg as string);
    console.log(unpacksg); // Log the unpacked message for debugging

    // Expect the packed message to not be null
    expect(packmsg).not.toBeNull();
  });
});
