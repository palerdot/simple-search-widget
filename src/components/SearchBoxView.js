// search box widget
import React from 'react'

const SearchBoxView = function (props) {
  return (
    <div className="search-box-holder">
      <div className="search-box-icons">
        <i className="fa fa-search"></i>
      </div>
      <div className="search-box">
        <input type="text" 
          id="search-query-input"
          value={props.query}
          onChange={(e) => props.searchHandler(e.target.value)} 
          placeholder="Search user by id, name, items, address, pincode ..." />
      </div>
      <div className="search-box-icons"
        onClick={() => props.clearSearchQuery()}
      >
        <i className="fa fa-times"></i>
      </div>
    </div>
  )
}

export default SearchBoxView