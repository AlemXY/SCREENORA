import MainHeader from "./layouts/MainHeader";
import Banner from "./home/Banner";
import Tendencias from "./home/Tendencias";
import Estrenos from "./home/Estrenos";
import Destacado from "./home/Destacado";
import Catalogo from "./home/Catalogo";
import MainFooter from "./layouts/MainFooter";

function App() {
  return (
    <main className="bg-screenora-bg text-white">
      <MainHeader />
      <Banner />
      <Tendencias />
      <Estrenos />
      <Destacado />
      <Catalogo />
      <MainFooter />
    </main>
  );
}

export default App;
