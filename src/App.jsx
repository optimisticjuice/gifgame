import { useState } from 'react';
import axios from 'axios';

function App() {

  const [gifs, setGifs] = useState([]);  // To store gif data
  const [search, setSearch] = useState(''); // for search strings
  const [loading, setLoading] = useState(false); // for loading state
  const [limit, setLimit] = useState(18); // for limit of gifs
  const [isCovered, setIsCovered] = useState(false);
  const [randomGif, setRandomGif] = useState(null);
  const [coverSpeed, setCoverSpeed] = useState(5000);
  const [score, setScore] = useState(0);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const searchGifs = async () => {
    setRandomGif(null)
    setIsCovered(false)
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          api_key: API_KEY,
          q: search,
          limit: limit,
        }
      });
      const gifsWithColor = response.data.data.map((gif) => ({
        ...gif,
        color: 'grey'
      }));
      setGifs(gifsWithColor);
      const randomGif = gifsWithColor[Math.floor(Math.random() * gifsWithColor.length)];
      console.log(randomGif);
      setTimeout(() => {
        setRandomGif(randomGif)
      }, coverSpeed / 2)
      setTimeout(() => {
        setIsCovered(true)
      }, coverSpeed);
    } catch (error) {
      console.log("Error fetching data", error);
    } finally {
      setLoading(false)
    }
  }

  const checkMatching = (gifId) => {
    if (gifId === randomGif.id) {
      setScore(prev => prev + 1);
      const rightGif = gifs.find(gif => gif.id === gifId);
      if (rightGif) {
        rightGif.color = 'green';
      }
    } else {
      setScore(prev => prev - 1);
      const wrongGif = gifs.find(gif => gif.id === gifId);
      if (wrongGif) {
        wrongGif.color = 'red';
        setTimeout(() => {
          wrongGif.color = 'grey';
          setGifs([...gifs]);
        }, 1000)
      }
    }
  }

  const handleDifficulty = (e) => {
    setLimit(e.target.value);
    switch (e.target.value) {
      case 10:
        setCoverSpeed(7500)
        break;
      case 18:
        setCoverSpeed(5000)
        break;
      case 27:
        setCoverSpeed(2500)
        break;

      default:
        break;
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Giphy Game</h1>
      <h2 style={{ color: score < 0 ? "red" : "black" }}>Your score: {score}</h2>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Enter your gif's name here"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { searchGifs(); } }}
          style={{
            width: "500px",
            height: "30px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <label htmlFor="difficulty">Difficulty:</label>
        <select name="difficulty" id="difficulty" value={limit} onChange={handleDifficulty}>
          <option value="10">Easy</option>
          <option value="18">Medium</option>
          <option value="27">Hard</option>
        </select>
      </div>
      <br />
      <button
        onClick={() => searchGifs()}
        style={{
          padding: "10px",
          margin: "10px",
          backgroundColor: "blue",
          color: "white",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Search
      </button>
      {randomGif &&
        <img src={randomGif.images.fixed_height.url} alt={randomGif.title}
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />
      }
      {loading ? (
        <p>
          <img src="public/bally.svg" alt="Loading Spinner" />
        </p>
      )
        :
        (
          <div
            style={{
              display: 'grid',
              gap: "3px",
              marginTop: "10px",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))"
            }}
          >
            {gifs.map((gif) => (
              <div key={gif.id} onClick={() => checkMatching(gif.id)}>
                {!isCovered ?
                  <img src={gif.images.fixed_height.url} alt={gif.title}
                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px" }}
                  /> : <div style={{ width: "120px", height: "120px", backgroundColor: `${gif?.color}`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>I am the one</div>
                }
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

export default App;
