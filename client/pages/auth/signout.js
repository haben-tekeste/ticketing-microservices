import useRequest from "../../hooks/useRequest";
import { useEffect } from "react";
import Router from "next/router";

export default () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    body: {},
    method: "post",
    onSuccess: () => Router.push("/"),
  });
  useEffect(() => {
    doRequest();
  }, []);
  return <h1>You're signing out</h1>;
};
