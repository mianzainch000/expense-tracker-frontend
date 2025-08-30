import Login from "./auth/login/template";

const Home = () => {
  return <Login />;
};

export default Home;

export function generateMetadata() {
  return { title: "Login" };
}
