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
      highlighted: false,
      disable_mouse_events: false
    }
  }

  // START: lifecycle methods
  componentWillMount() {
    // attach event listeners to document to look for KEY UP/DOWN
    document.addEventListener("keydown", _.throttle((e) => {
      // before handling keyboard disable mouse events
      this._handleKeyPress(e)
    }, 100))
    document.addEventListener("mousemove", _.throttle((e) => {
      this._handleMouseMove(e)
    }, 200))
  }

  componentWillUnmount() {
    // remove event listeners
    document.removeEventListener("keydown", (e) => this._handleKeyPress(e))
    document.removeEventListener("mousemove", (e) => this._handleMouseMove(e))
  }
  // END: lifecycle methods

  // helper function to throttle mousemove 
  // on mousemove we will be enabling/restoring mouse events
  _handleMouseMove(e) {
    // check if mouse events are already disabled
    if (!this.state.disable_mouse_events) {
      // do not set 
      return
    }
    // enable mouse events
    this.setState({
      disable_mouse_events: false
    })
  }

  // helper function to enable/disable mouse events from inside components
  // NOTE: if DISABLED; they are ENABLED back on 'MOUSEMOVE'
  disableMouseEventHandler(value) {
    this.setState({
      disable_mouse_events: value
    })
  }

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
      // prevent the cursor focus from going to start of the text
      e.preventDefault()
      this.setState({
        disable_mouse_events: true
      })
      this._handleUpNavigation()
      // enabling will be done when mouse move happens
    } else if (e.key === "ArrowDown") {
      this.setState({
        disable_mouse_events: true
      })
      this._handleDownNavigation()
      // enabling will be done when mouse move happens
    }

  }

  _handleUpNavigation() {
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
    } else {
      // special case: if nothing is highlighted already
      // highlight the first one
      this.setState({
        highlighted: _.head(this.state.results).id
      })
    }
  }

  _handleDownNavigation() {
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
    } else {
      // special case: if nothing is highlighted already
      // highlight the first one
      this.setState({
        highlighted: _.head(this.state.results).id
      })
    }
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

    // scroll to top with new results
    let container = document.getElementById('card-holder')
    if (container) {
      // scroll to top
      container.scrollTop = 0
    }
    
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
          disable_mouse_events={this.state.disable_mouse_events}
          disableMouseEventHandler={(value) => this.disableMouseEventHandler(value)}
        />

      </div>
    )
  }
}

export default SearchWidget

