// view to display search results
import React from 'react'

// search result card component
import SearchResult from './SearchResult'

const SearchResultsView = function (props) {
  return (
    <div id="search-results-view" className="search-results-view">
      {
        props.results.length === 0 
        ? (<div className="no-users-msg">No Users found</div>)
        : (
          <div id="card-holder" className="card-holder">
            {props.results.map((res) => 
              <SearchResult
                key={res.id} 
                res={res}
                highlighted={props.highlighted}
                disable_mouse_events={props.disable_mouse_events}
                highlightHandler={(id) => props.highlightHandler(id)}
              />
            )}
          </div>
        )
      }
    </div>
  )
}

export default SearchResultsView