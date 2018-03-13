// single search result card
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

import _ from 'lodash'

class SearchResult extends PureComponent {

  // START: LIFECYCLE METHODS

  componentDidMount() {
    this.throttleHandler = _.throttle(() => this._scrollHandler(), 150)
  }

  componentDidUpdate() {
    this.throttleHandler()
    // this._scrollHandler()
  }
  // END: LIFECYCLE METHODS

  // helper function to find out if the element is in view inside the scrollable element
  _checkInView(container, element, partial) {

    //Get container properties
    let cTop = container.scrollTop
    let cBottom = cTop + container.clientHeight

    //Get element properties
    // let eTop = element.offsetTop
    let eTop = element.offsetTop - container.offsetTop
    let eBottom = eTop + element.clientHeight

    //Check if in view    
    let isTotal = (eTop >= cTop && eBottom <= cBottom)
    let isPartial = partial && (
      (eTop < cTop && eBottom > cTop) ||
      (eBottom > cBottom && eTop < cBottom)
    )

    //Return outcome
    return  (isTotal  || isPartial)
  }

  _scrollHandler() {

    if (this._isHighLighted(this.props.res.id)) {

      let container = document.getElementById('card-holder')
      let elem = ReactDOM.findDOMNode(this)
      let scrollTo = elem.offsetTop - container.offsetTop - elem.offsetHeight
      // scroll only if element is not in view
      if (!this._checkInView(container, elem, false)) {
        // disable mouse events (will be enabled back on mousemove)
        this.props.disableMouseEventHandler(true)
        // perform the scroll
        container.scrollTop = scrollTo
      }

    }
  }

  // helper function to find out if this result is highlighted
  _isHighLighted(id) {
    return this.props.highlighted === id
  }

  // helper function to handle mouse movement
  _mouseEnterHandler(e) {
    if (this.props.disable_mouse_events) {
      // let us wait for mouse events to be enabled
      // do not proceed
      return
    }
    this._highlightSelection()
  }

  // highlight current selection
  _highlightSelection() {
    // if this result is already highlighted just drop off
    if (this._isHighLighted(this.props.res.id)) {
      // do not proceed
      return
    }
    this.props.highlightHandler(this.props.res.id)  
  }

  // throttled version
  _throttledMouseEnterHandler() {
    return _.throttle((e) => {
      this._mouseEnterHandler(e)
    }, 300, {trailing: false, leading: true})
  }

  render() {

    let res = this.props.res

    return (
      <div 
        className={"card " + (this._isHighLighted(res.id) ? 'highlighted' : '')}
        onMouseOver={(e) => this._throttledMouseEnterHandler()(e)}
        onMouseLeave={this._throttledMouseEnterHandler().cancel()}
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