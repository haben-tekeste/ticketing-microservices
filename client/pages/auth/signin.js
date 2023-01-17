import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    body: { email, password },
    url: "https://ticketing.dev/api/users/signin",
    method: "post",
    onSuccess: () => router.push("/"),
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };
  return (
    <form onSubmit={onSubmit}>
      <h3>Sign In</h3>
      <div className="form-group m-2">
        <label>E-mail</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          type="text"
        />
      </div>
      <div className="form-group m-2">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          type="password"
        />
      </div>
      {errors}
      <div className="form-group m-2">
        <button className="btn btn-primary" type="submit">
          Sign In
        </button>
      </div>
    </form>
  );
};
