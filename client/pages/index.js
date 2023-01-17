import axios from "axios";

const LandingPage = ({ data: { currentUser } }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
};

export const getServerSideProps = async ({ req }) => {
  const { data } = await axios.get(
    "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
    {
      // need to attach the cookie obtained after request to client service
      headers: req.headers,
    }
  );
  return {
    props: {
      data,
    },
  };
};

export default LandingPage;
