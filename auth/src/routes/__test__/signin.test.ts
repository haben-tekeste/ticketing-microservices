import request from "supertest";
import { app } from "../../app";

it("fails when non existing email is provied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "23oirsbdkjsd" })
    .expect(400);
});

it("fails when password does not match", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1o2i3" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "asdkfjlwek0" })
    .expect(400);
});

it("responds with a cookie upon successful sign in", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "asdkfjlwek0" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "asdkfjlwek0" });

  expect(response.get("Set-Cookie")).toBeDefined();
});
