import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import Page from './pages/Page'
import Page2 from './pages/Page2'
import FoodDataSearchResults from './pages/FoodDataSearchResults'
import NotFound from './pages/NotFound'

const App = () => {
  const [searchTerm, setSearchTerm] = useState()
  const [currentPageNumber, setCurrentPageNumber] = useState()
  const [foodSearchData, setFoodSearchData] = useState()
  const [database, setDatabase] = useState('All')

  // prettier-ignore
  const getFoodTileData = async () => {
    if (typeof searchTerm === 'undefined') return
//    const apiKey = `https://api.nal.usda.gov/fdc/v1/search?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa` // &generalSearchInput=${searchTerm}`
    const apiKey = `https://localhost:5001/fdc/v1/Proxy?searchTerm=${searchTerm}` //api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa&
    console.log( 'Attempting to request food data from: ' + apiKey + '. Searching for: ' + searchTerm )
    const resp = await axios.get(apiKey)
      // {
      // generalSearchInput: searchTerm,
      // requireAllWords: true,
      // pageNumber: typeof currentPageNumber === 'undefined' || currentPageNumber == null ? 1 : currentPageNumber, 
      // includeDataTypes: { 
      //   "Survey (FNDDS)": database === 'All' || database === 'Survey (FNDDS)' ? true : false,
      //   Foundation: database === 'All' || database === 'Foundation' ? true : false,
      //   Branded: database === 'All' || database === 'Branded' ? true : false,
      //   "SR Legacy": database === 'All' || database === 'SR Legacy' ? true : false
      // }
    // }
    // , 
    //   { headers: { "Content-Type": "application/json" } }
    
    if (resp.status !== 200) {
      console.log(resp.status)
      return
    }
    setFoodSearchData(resp.data.foods)
    console.dir(resp.data)
  }

  useEffect(() => {
    getFoodTileData()
  }, [currentPageNumber])

  const handleNewSearch = () => {
    getFoodTileData()
    setCurrentPageNumber(1)
  }

  const updateSearchTerm = e => {
    const val = e.target.value
    setSearchTerm(val)
  }

  return (
    <Router>
      <header>
        <h1>USDA Food Databank</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Bookmarks">Bookmarks</Link>
            </li>
            <li>
              <Link to="/Login">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
      {/* prettier-ignore */}
      <section className="searchCont">
        <input type="text" name="searchTerm" value={searchTerm} onChange={updateSearchTerm} />
        <button name="Search" className="searchButton" onClick={handleNewSearch}>Search</button>
      </section>
      <Switch>
        <Route exact path="/" component={FoodDataSearchResults}></Route>
        <Route exact path="/:search" component={Page}></Route>
        <Route exact path="/2" component={Page2}></Route>
        <Route path="*" component={NotFound}></Route>
      </Switch>
    </Router>
  )
}

export default App
