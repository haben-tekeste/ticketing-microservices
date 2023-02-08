import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natswrapper } from "../../nats-wrapper";


it("has route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("user must be signed in to access it", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("should return status other than 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set('Accept', 'application/json')
    .set("Cookie", global.cookieRetrieval())
    .send({});

  console.log(response);

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.cookieRetrieval())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.cookieRetrieval())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.cookieRetrieval())
    .send({
      title: 'asldkjf',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.cookieRetrieval())
    .send({
      title: 'laskdfj',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'asldkfj';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.cookieRetrieval())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const title = 'asldkfj';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.cookieRetrieval())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natswrapper.Client.publish).toHaveBeenCalled();
});