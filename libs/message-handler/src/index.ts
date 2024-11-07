import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('PickupClient', () => {
  let mockAdapter: MockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAdapter.restore();
  });

  it('should send a pickup request', async () => {
    const mockResponse = { success: true };
    mockAdapter
      .onPost('https://example.com/mediation-endpoint')
      .reply(200, mockResponse);
  });
});
