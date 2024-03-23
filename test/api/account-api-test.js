
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { init, stop } from '../../src/server.js'; 

chai.use(chaiHttp);

describe('Accounts API Tests', () => {
  let server;

  async function startServer() {
    server = await init();
  }

  before(async () => {
    await startServer();
  });


  after(async () => {
    await stop();
  });

  it('should create a new user', async () => {
    const response = await chai.request(server.listener)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test User', role: 'user' });

    expect(response).to.have.status(201);
    expect(response.body).to.include({ email: 'test@example.com', name: 'Test User' });
  });


});
