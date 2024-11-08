import { describe, expect, test } from 'vitest';
import { buildMsg, pack_encrypted } from '../mediation-coordination';
import { MEDIATE_REQUEST } from '../protocols/message_types';

const To: string[] = [
  'did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0',
];
const msg = {
  id: 'uuid',
  typ: 'application/didcomm-plain+json',
  type: 'https://didcomm.org/coordinate-mediation/2.0/mediate-request',
  body: {},
  from: 'did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0',
  to: [
    'did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0',
  ],
  headers: { return_route: 'all' },
};

describe('didcomm', () => {
  test('build and pack message ', async () => {
    const buildmsg = await buildMsg(To, MEDIATE_REQUEST, {});
    const packmsg = await pack_encrypted(To, buildmsg);
    expect(packmsg).not.toBeNull();

    expect(buildmsg).toEqual(msg);
  });
});
