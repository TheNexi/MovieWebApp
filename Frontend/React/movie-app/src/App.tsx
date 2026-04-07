import { useEffect } from "react";
import { getAllMovies } from "./services/movie/movieApi";

function App() {
  useEffect(() => {
    getAllMovies()
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return <h1>Sprawdz konsole czy zwraca movie</h1>;
}

export default App;