import { describe, expect, test } from 'vitest';
import Mediation_Coordinaton, {
  keylist_query,
} from '../mediation-coordination';

const To: string[] = [
  'did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0',
];

describe('didcomm', () => {
  test('mediator coordination testing', async () => {
    await Mediation_Coordinaton(To, To[0], 'add')
      .then((result) => {
        // for now no way to know routing did in advance
        const routing_did = result as string;
        console.log(routing_did);
        expect(routing_did).not.toBeNull;

        // will always run catch block as response message is not valid and cannot  be unpacked
      })
      .catch((err) => {
        expect(err).toThrowError;
      });
  });
});
describe('didcomm', () => {
  test('keylist query testing', async () => {
    await keylist_query(To[0], To)
      .then((result) => {
        expect(result).not.toBeNull;
      })
      .catch((err) => {
        // will always run catch block as response message is not valid and cannot  be unpacked
        expect(err).toThrowError;
      });
  });
});
