import  { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  
  
  const [gifs, setgifs] = useState([]);  // To store gif data
  const [search, setSearch] = useState(''); // for search strings
  const [loading, setloading] = useState(false); // for loading state
  const [limit, setlimit] = useState(27); // for limit of gifs
  
  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // function to search gifs
  const limitmin = 1;
  const limitmax = 50;
  const searchgifs = async () => {
    // loading true
    setloading(true);
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          api_key: API_KEY,
          q: search,
          limit: limit,
        }
      });
      // setGifs for the array of gifs from the response.data.data api using giphy api
      setgifs(response.data.data);
      console.log(gifs);
      console.log(gif.images);
    } catch (error) {
      console.log("Error fetching data" + error);

    }finally{
      // loading false 
      setloading(false)
    }
  } 
  // Download Gif 

  const downloadGif = async (gifUrl, gifid) => {
    try {   
      const res = await fetch(gifUrl);
      const blob = await res.blob(); //binary large object

      // create a temporary link element for the gif
      const url = window.URL.createObjectURL(blob); //create a temporary URl for the downloaded GIF blob, It allowes the browser to treat the blob as a real file that can be downloaded
      const a = document.createElement("a");// create  a hidden <a> tag in the DOM (a link element)
      a.href = url;
      a.download = `Gif : ${gifid}.gif`;
      document.body.appendChild(a);//not visible
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading gif", error);
    }
  };

  //  Delete Gif 
  const deleteGif = (gifid) => {
    const newGifs = gifs.filter((gif) => gif.id !== gifid);
    setgifs(newGifs);
  };

  //useEffect logic for search
 
  useEffect(() => {
  searchgifs();    
}, []);
  // Toggle for Dark Mode and Light Mode

  // Step 1: Create a state variable and a setter function to toggle the theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Step 2: Use effect to load the saved theme from localStorage

  // Local Storage and save theme?

  // Step 3: Toggle the theme and save the choice to localStorage
  // Toggle Theme from light to dark 

  // useEffect 
  return (
    
      <div style={{textAlign: "center", padding: "20px"}}>

<h1>Search Giphy : </h1> 

<input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={(e) => {
        if (e.key === 'Enter') {
          searchgifs();
        }
      }}
      style={{
        padding: "10px", 
        width: "500px", 
        marginBottom: "10px", 
        borderRadius: "5px", 
        border: "1px solid #ccc"
      }} />
<br/>
    <input type='range' value={limit} min={limitmin} max={limitmax} style={{width: "800px"}} onChange={(e) => setlimit(e.target.value)}/>
<br/>
          <br/>
          <p>Range: <input type='num' style={{width: "30px"}} value={limit} onChange={(e) => setlimit(e.target.value)}/></p>
          <br/>

          <button 
      onClick={() => searchgifs()}
    
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
      <div key={gif.id}>
      <img src={gif.images.fixed_height.url} alt={gif.title}       
      style={{
                width: "120px", 
                height: "120px", 
                objectFit: "cover", 
                borderRadius: "10px"
              }}
         />
      
      <button onClick={() => downloadGif(gif.images.fixed_height.url,gif.id)}style={{marginTop: "3px", padding: "3px", color: 'brown', backgroundColor: "#f9f9f9", borderRadius: "3px", cursor: "copy"}}>Download Gif</button>
      <button onClick={() => deleteGif(gif.id)} style={{margin: "2px", padding: "3px", color: 'red', backgroundColor: "#f9f9f9", borderRadius: "3px"}}>&nbsp;Delete Gif&nbsp;</button>
      </div>
      
    )
    )
  }
    
      </div>
    )
    }

    </div>
  )  
}
// Add comments to the code to make it more readable and understandable 

export default App;
