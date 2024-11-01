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
      const verificationMethods: VerificationMethod[] = [];

      chain.forEach((item, index) => {
        const id = `#key-${index + 1}`;
        const { purpose, multikey } = item;

        let type = '';
        if (purpose === 'Verification') {
          if (!authentication.includes(id)) authentication.push(id);
          type = 'Ed25519VerificationKey2020';
        } else if (purpose === 'Encryption') {
          if (!keyAgreement.includes(id)) keyAgreement.push(id);
          type = 'X25519KeyAgreementKey2020';
        }

        // Only add to verificationMethods if type is non-empty
        if (type) {
          const method: VerificationMethod = {
            id,
            type: type,
            controller: did,
            publicKeyMultibase: multikey,  // Use multikey directly without adding "z" prefix
          };
          verificationMethods.push(method);
        }
      });

      const services: Service[] = [];
      let serviceNextId = 0;

      chain
        .filter(({ purpose }) => purpose === 'Service')
        .forEach(({ multikey }) => {
          const decodedService = Buffer.from(multikey, 'base64').toString('utf-8');
          const service = reverseAbbreviateService(decodedService);

          if (!service.id) {
            service.id = serviceNextId === 0 ? '#didcomm' : `#didcomm-${serviceNextId}`;
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
