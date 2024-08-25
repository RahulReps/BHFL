import React, { useState } from "react";
import "./App.css"; // Optional, for custom styling

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResponse(null);

    try {
      const jsonData = JSON.parse(inputValue);

      if (!Array.isArray(jsonData.data)) {
        throw new Error("Invalid JSON format");
      }

      const res = await fetch(
        "https://rahulhost-50021977879.development.catalystappsail.in/bhfl",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
          redirect: "follow"
        }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setResponse(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSelectChange = (event) => {
    const options = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(options);
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = response;

    // Ensure highest_lowercase_alphabet is always an array
    const highestLowercaseAlphabetArray = Array.isArray(
      highest_lowercase_alphabet
    )
      ? highest_lowercase_alphabet
      : highest_lowercase_alphabet
      ? [highest_lowercase_alphabet]
      : [];

    const filteredData = {
      Alphabets: selectedOptions.includes("Alphabets") ? alphabets : [],
      Numbers: selectedOptions.includes("Numbers") ? numbers : [],
      "Highest lowercase alphabet": selectedOptions.includes(
        "Highest lowercase alphabet"
      )
        ? highestLowercaseAlphabetArray
        : [],
    };

    return Object.entries(filteredData).map(
      ([key, value]) =>
        value.length > 0 && (
          <div key={key}>
            <h3>{key}</h3>
            <ul>
              {value.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )
    );
  };

  return (
    <div className="App">
      <h1>21BCE1437</h1> {/* Replace with your roll number */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows="5"
          cols="40"
          placeholder='Enter JSON here, e.g., {"data": ["A", "C", "z"]}'
        />
        <button type="submit">Submit</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      {response && (
        <div>
          <label>Select Options:</label>
          <select multiple={true} onChange={handleSelectChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">
              Highest lowercase alphabet
            </option>
          </select>
        </div>
      )}
      <div>{renderResponse()}</div>
    </div>
  );
};

export default App;
