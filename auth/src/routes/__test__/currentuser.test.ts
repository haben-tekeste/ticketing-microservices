import request from "supertest";
import { app } from "../../app";

it("responds with current user info such as email", async () => {
  //   const authResponse = await request(app)
  //     .post("/api/users/signup")
  //     .send({ email: "test@test.com", password: "random312" })
  //     .expect(201);

  //   const cookieValue = authResponse.get("Set-Cookie");
  const cookieValue = await global.cookieRetrieval();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookieValue)
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});
