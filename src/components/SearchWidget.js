// main search widget component
import React, { Component } from 'react'

import _ from 'lodash'

// import our user data
import data from '../data/data'

// importing components
import SearchBoxView from './SearchBoxView'
import SearchResultsView from './SearchResultsView' 

class SearchWidget extends Component {
  constructor(props) {
    super(props)
    // setting the state
    this.state = {
      query: "",
      results: [],
      highlighted: false
    }
  }

  // START: lifecycle methods
  componentWillMount() {
    // attach event listeners to document to look for KEY UP/DOWN
    document.addEventListener("keydown", (e) => this._handleKeyPress(e))
  }

  componentWillUnmount() {
    // remove event listeners
    document.removeEventListener("keydown", (e) => this._handleKeyPress(e))
  }
  // END: lifecycle methods

  // START: helper functions to handle key up/down
  _handleKeyPress(e) {
    // if no results nothing to do anyway
    if (_.isEmpty(this.state.results)) {
      // do not proceed
      return
    }

    // lose the mouse focus by focussing on the text element
    document.getElementById('search-query-input').focus()

    // handle key up
    if (e.key === "ArrowUp") {
      // we have results and we need to move up
      let current_index = _.findIndex(this.state.results, (res) => res.id === this.state.highlighted)
      if (current_index > -1) {
        // we have an item; move up should reduce the index
        // if already first item; do not do anything
        if (current_index === 0) {
          // do not proceed
          return
        }
        // we have to move up to the new item
        let new_item = _.nth(this.state.results, current_index - 1)
        // update the highlighted to new item
        this.setState({
          highlighted: new_item.id
        })
        // all done
        return
      }

    } else if (e.key === "ArrowDown") {
      // we need to move down
      let current_index = _.findIndex(this.state.results, (res) => res.id === this.state.highlighted)
      if (current_index > -1) {
        // we have an item; move down should increase the index
        // if last item do not do anything
        if (current_index === _.size(this.state.results) - 1) {
          // do not proceed
          return
        }
        // we have to move down to the new item
        let new_item = _.nth(this.state.results, current_index + 1)
        // update the highlighted to new item
        this.setState({
          highlighted: new_item.id
        })
        // all done
        return
      }

    }

    // special case: if nothing is highlighted already
    // highlight the first one
    this.setState({
      highlighted: _.head(this.state.results).id
    })

  }
  // END: helper functions to handle key up/down

  performSearch(query) {

    // handle empty search term
    if (query.length === 0) {
      this.setState({
        query: query,
        results: []
      })
      // do not proceed
      return  
    }

    // filter results from our data
    const results = _.filter(data, (d) => {
      // walk through all the properties and perform the search
      let match = _.map(d, (value) => this._isMatch(value, query))
      return _.size(_.compact(match)) > 0
    })

    this.setState({
      query: query,
      results: results,
      highlighted: false
    })
  }

  // clear search query
  clearSearchQuery() {
    this.setState({
      query: "",
      results: [],
      highlighted: false
    })
  }

  // helper function to return the selected item on hover
  highlightSelection(id) {
    // make selection as highlighted
    this.setState({
      highlighted: id
    })
  }

  // helper functions to help with query
  // finds is target is present inside source for a string
  _isStringMatch(source, target) {
    return source.toLowerCase().indexOf( target.toLowerCase() ) >= 0
  }

  // finds if the target is present in any of the array items
  _isArrayMatch(arr, target) {
    // transform the source to lower case
    let source = _.map(arr, (a) => a.toLowerCase())
    return _.includes(source, target.toLowerCase())
  }

  // takes a generic source (array or string)
  // sniffs the type and then calls the appropriate helper function
  _isMatch(source, target) {
    if (_.isArray(source)) {
      return this._isArrayMatch(source, target)
    } else {
      return this._isStringMatch(source, target)
    }
  }

  render() {
    return (
      <div className="search-widget">
        
        <SearchBoxView 
          query={this.state.query}
          searchHandler={(query) => this.performSearch(query)}
          clearSearchQuery={() => this.clearSearchQuery()}
        />

        <SearchResultsView 
          results={this.state.results}
          highlighted={this.state.highlighted}
          highlightHandler={(id) => this.highlightSelection(id)}
        />

      </div>
    )
  }
}

export default SearchWidget

