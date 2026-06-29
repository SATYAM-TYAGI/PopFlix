import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import MyList from "./components/MyList";
import Categories from "./components/Categories";
import "./App.css";

function App() {
  const token = localStorage.getItem("token");
  const [currentView, setCurrentView] = useState("dashboard");
  const [movieFromCategories, setMovieFromCategories] = useState(null);

  // no token = show landing/login page
  if (!token) {
    return <Home />;
  }

  const openMovieFromCategories = (movie) => {
    setMovieFromCategories(movie);
    setCurrentView("dashboard");
  };

  return (
    <>
      {currentView === "dashboard" && (
        <Dashboard
          key={movieFromCategories?.id ?? "dashboard"}
          onViewChange={setCurrentView}
          initialMovie={movieFromCategories}
        />
      )}
      {currentView === "categories" && (
        <Categories onViewChange={setCurrentView} onMovieClick={openMovieFromCategories} />
      )}
      {currentView === "mylist" && <MyList onViewChange={setCurrentView} />}
    </>
  );
}

export default App;
