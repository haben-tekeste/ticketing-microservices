import { useState } from "react";
import axios from "axios";

export default ({ body, url, method, onSuccess }) => {
  // method === [PUT, POST, PATCH, GET ...]
  const [errors, setErrors] = useState(null);

  // function to make request
  const doRequest = async () => {
    try {
      const { data } = await axios({
        method,
        data: body,
        url,
      });
      setErrors(null);
      if (onSuccess) onSuccess(data);
      return data;
    } catch (error) {
      console.log(error);
      setErrors(
        <div className="alert alert-danger m-2">
          <h4>Oooops...</h4>
          <ul className="my-0">
            {error.response.data.errors.map((err) => {
              return <li key={err.message}>{err.message}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
