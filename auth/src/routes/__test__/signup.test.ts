import { app } from "../../app";
import request from "supertest";

it("returns 201 status code upon successful sign up", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "abd230239" });
  expect(response.status).toEqual(201);
});

it("returns 400 status code on invalid email", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test", password: "skdfj2192j" });
  expect(response.status).toEqual(400);
});

it("returns 400 status code on password less than 5 or greater than 20", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "adc" });
  expect(response.status).toEqual(400);
});

it("returns 400 status code on missing email or password", async () => {
  let response = await request(app)
    .post("/api/users/signup")
    .send({ password: "akdflj1239823" });
  expect(response.status).toEqual(400);

  response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" });
  expect(response.status).toEqual(400);
});

it("returns 400 upon duplicate emails for sign up", async () => {
  let response;

  response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "adkfj3920" });
  expect(response.status).toEqual(201);

  response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "sdfkjh2038" });
  expect(response.status).toEqual(400);
});

it("sets cookie upon successful sign up", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "sldk292-dj" });
  expect(response.get("Set-Cookie")).toBeDefined(); 
});
