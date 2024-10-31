import { Buffer } from 'buffer';
import { DIDDoc, DIDResolver, Service, VerificationMethod } from 'didcomm';
import base64url from 'base64url';

type Purpose =
  | 'Assertion'
  | 'Encryption'
  | 'Verification'
  | 'CapabilityDelegation'
  | 'CapabilityInvocation'
  | 'Service';

export default class PeerDIDResolver implements DIDResolver {
  private diddocs: DIDDoc[];

  constructor(diddocs: DIDDoc[] = []) {
    this.diddocs = diddocs;
  }

  static default(): PeerDIDResolver {
    return new PeerDIDResolver([
      {
        id: '',
        keyAgreement: [],
        authentication: [],
        verificationMethod: [],
        service: []
      }
    ]);
  }

  async resolve(did: string): Promise<DIDDoc | null> {
    try {
      const existingDIDDoc = this.diddocs.find(doc => doc.id === did);
      if (existingDIDDoc) return existingDIDDoc;

      if (!did.startsWith('did:peer:')) {
        throw new Error('Unsupported DID method');
      }

      const chain = did
        .replace(/^did:peer:2\./, '')
        .split('.')
        .map((e) => {
          const purposeCode = e.charAt(0);
          const purpose = mapPurposeFromCode(purposeCode);
          const multikey = e.slice(1);
          return { purpose, multikey };
        });

      const authentication: string[] = [];
      const keyAgreement: string[] = [];
      const assertionMethod: string[] = [];
      const verificationMethods: VerificationMethod[] = [];

      chain
        .filter(({ purpose }) => purpose !== 'Service')
        .forEach((item, index) => {
          const id = `#key-${index + 1}`;
          const { purpose, multikey } = item;

          switch (purpose) {
            case 'Assertion':
              assertionMethod.push(id);
              break;
            case 'Verification':
              authentication.push(id);
              break;
            case 'Encryption':
              keyAgreement.push(id);
              break;
          }

          const method: VerificationMethod = {
            id,
            type: 'X25519KeyAgreementKey2019',
            controller: did,
            publicKeyMultibase: `z${multikey}`,
          };

          verificationMethods.push(method);
        });

      const services: Service[] = [];
      let serviceNextId = 0;

      chain
        .filter(({ purpose }) => purpose === 'Service')
        .forEach(({ multikey }) => {
          const decodedService = Buffer.from(multikey, 'base64').toString('utf-8');
          const service = reverseAbbreviateService(decodedService);

          if (!service.id) {
            service.id = serviceNextId === 0 ? '#service' : `#service-${serviceNextId}`;
            serviceNextId++;
          }

          services.push(service);
        });

      const diddoc: DIDDoc = {
        id: did,
        keyAgreement,
        authentication,
        verificationMethod: verificationMethods,
        service: services,
      };

      this.diddocs.push(diddoc);
      return diddoc;
    } catch (error) {
      console.error('Error resolving DID:', error);
      return null;
    }
  }
}

function reverseAbbreviateService(decodedService: string): Service {
  const parsed = JSON.parse(decodedService);
  return {
    id: parsed.id || '',
    type: 'DIDCommMessaging',
    serviceEndpoint: parsed.s,
  };
}

function mapPurposeFromCode(code: string): Purpose {
  switch (code) {
    case 'A':
      return 'Assertion';
    case 'E':
      return 'Encryption';
    case 'V':
      return 'Verification';
    case 'D':
      return 'CapabilityDelegation';
    case 'I':
      return 'CapabilityInvocation';
    case 'S':
      return 'Service';
    default:
      throw new Error('Invalid purpose prefix');
  }
}
