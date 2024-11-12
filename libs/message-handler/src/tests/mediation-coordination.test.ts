import { describe, expect, test } from 'vitest';
import { buildMsg, packEncrypted, unpack } from '../mediation-coordination';
import { MEDIATE_REQUEST } from '../protocols/message_types';

const To: string[] = [
  'did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0',
];

describe('didcomm', () => {
  test('build, pack and unpack message ', async () => {
    const buildmsg = await buildMsg(To, MEDIATE_REQUEST, {});
    const packmsg = await packEncrypted(buildmsg);
    const unpackmsg = await unpack(packmsg, To);

    expect(packmsg).not.toBeNull();
    expect(unpackmsg?.as_value()).toEqual(buildmsg);
  });
});
