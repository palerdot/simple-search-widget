// single search result card
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import _ from 'lodash'

class SearchResult extends Component {

  // START: LIFECYCLE METHODS

  componentDidUpdate() {
    // if this card is highlighted scroll this into view
    if (this._isHighLighted(this.props.res.id)) {
      let container = document.getElementById('card-holder')
      let elem = ReactDOM.findDOMNode(this)
      let scrollTo = elem.offsetTop - container.offsetTop - elem.offsetHeight
      console.log('scrolling ', scrollTo)
      container.scrollTop = scrollTo
    }
  }
  // END: LIFECYCLE METHODS

  // helper function to find out if this result is highlighted
  _isHighLighted(id) {
    return this.props.highlighted === id
  }

  // helper function to handle mouse movement
  _mouseEnterHandler(e) {
    if (this.props.disable_mouse_events) {
      console.log('MOUSE MOVE DISABLED')
      return
    }
    console.log('porumai! mouse enter ', this.props.res.id, this.props.highlighted)
    // if this result is already highlighted just drop off
    if (this._isHighLighted(this.props.res.id)) {
      // do not proceed
      return
    }
    this.props.highlightHandler(this.props.res.id) 
  }

  // debounced version
  _debouncedMouseEnterHandler(e) {
    return _.throttle((e) => this._mouseEnterHandler(e), 200)
  }

  render() {

    let res = this.props.res

    return (
      <div 
        className={"card " + (this._isHighLighted(res.id) ? 'highlighted' : '')}
        onMouseEnter={(e) => this._debouncedMouseEnterHandler(e)()}
        // onMouseEnter={(e) => {
        //   console.log('porumai! mouse enter ', res.id, this.props.highlighted)
        //   // if this result is already highlighted just drop off
        //   if (this._isHighLighted(res.id)) {
        //     // do not proceed
        //     return
        //   }
        //   this.props.highlightHandler(res.id) 
        // }}
        onMouseLeave={this._debouncedMouseEnterHandler().cancel()}
      >
        <div className="id">{res.id}</div>
        <div className="name">{res.name}</div>
        <div className="item">{_.join(res.items, ", ")}</div>
        <div className="item">{res.address}</div>
        <div className="item">{res.pincode}</div>
      </div>
    )
  }
}

export default SearchResult