import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("should return 404 if the ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
    .get(`/api/tickets/${id}`)
    .expect(404);
});

it("should return ticket if ticket is found", async () => {
  const title = "new ticket";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.cookieRetrieval())
    .send({
      title,
      price,
    })
    .expect(201);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(response.body.price);
});
