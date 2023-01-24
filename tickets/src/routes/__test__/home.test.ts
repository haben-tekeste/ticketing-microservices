import request from 'supertest'
import {app} from '../../app'
import { Ticket } from '../../models/ticket';

it('Fetches list of tickets', async () => {
    const title = 'asldkfj';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.cookieRetrieval())
    .send({
      title,
      price: 20,
    })

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.cookieRetrieval())
    .send({
      title:'random',
      price: 20,
    })

    const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

    expect(response.body.length).toEqual(2)
})