import buildClient from "../api/buildClient";

const LandingPage = ({currentUser}) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log('landing page');
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");
  return data;
};
// export const getServerSideProps = async ({ req }) => {

//   const { data } = await axios.get(
//     "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
//     {
//       // need to attach the cookie obtained after request to client service
//       headers: req.headers,
//     }
//   );
//   console.log('landing page');
//   return {
//     props: {
//       data
//     },
//   };
// };

export default LandingPage;
