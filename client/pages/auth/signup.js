import { useState } from "react";
import axios from "axios";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://ticketing.dev/api/users/signup",
        {
          email,
          password,
        }
      );
    } catch (error) {
      setErrors(error.response.data.errors);
    }
    // console.log(data);
    setEmail("");
    setPassword("");
  };
  return (
    <form onSubmit={onSubmit}>
      <h3>Sign Up</h3>
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
      <div className="form-group m-2">
        <button className="btn btn-primary" type="submit">
          Sign up
        </button>
      </div>
      {errors.length > 0 && (
        <div className="alert alert-danger m-2">
          <h4>Oooops...</h4>
          <ul className="my-0">
            {errors.map((error) => {
              return <li key={error.message}>{error.message}</li>;
            })}
          </ul>
        </div>
      )}
    </form>
  );
};
