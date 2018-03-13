// single search result card
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

import _ from 'lodash'

class SearchResult extends PureComponent {

  // START: LIFECYCLE METHODS

  componentDidMount() {
    this.throttleHandler = _.throttle(() => this._scrollHandler(), 350, {trailing: true, leading: true})
  }

  componentDidUpdate() {
    this.throttleHandler()
    // this._scrollHandler()
  }
  // END: LIFECYCLE METHODS

  // helper function to find out if the element is in view inside the scrollable element
  _checkInView(container, element, partial) {

    //Get container properties
    let cTop = container.scrollTop;
    let cBottom = cTop + container.clientHeight;

    //Get element properties
    // let eTop = element.offsetTop;
    let eTop = element.offsetTop - container.offsetTop;
    let eBottom = eTop + element.clientHeight;

    //Check if in view    
    let isTotal = (eTop >= cTop && eBottom <= cBottom);
    let isPartial = partial && (
      (eTop < cTop && eBottom > cTop) ||
      (eBottom > cBottom && eTop < cBottom)
    );

    console.log('checking ', eTop, eBottom, cTop, cBottom, isTotal, isPartial)

    //Return outcome
    return  (isTotal  || isPartial);
  }

  _scrollHandler() {

    if (this._isHighLighted(this.props.res.id)) {



      let container = document.getElementById('card-holder')
      let elem = ReactDOM.findDOMNode(this)
      let scrollTo = elem.offsetTop - container.offsetTop - elem.offsetHeight
      console.log('scrolling ', scrollTo, this._checkInView(container, elem, false), this.props.disable_mouse_events)
      // scroll only if element is not in view
      if (!this._checkInView(container, elem, false)) {
        // disable mouse events
        this.props.disableMouseEventHandler(true)
        // perform the scroll
        container.scrollTop = scrollTo
        console.log('scrolling end', this.props.res.id)  
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
      console.log('MOUSE MOVE DISABLED')
      // wait for some time to trigger stuffs
      // _.delay(() => this._highlightSelection(), 350)
      return
    }
    this._highlightSelection()
  }

  // highlight current selection
  _highlightSelection() {
    console.log('porumai! mouse enter ', this.props.res.id, this.props.highlighted, this._isHighLighted(this.props.res.id))
    // if this result is already highlighted just drop off
    if (this._isHighLighted(this.props.res.id)) {
      // do not proceed
      return
    }
    this.props.highlightHandler(this.props.res.id)  
  }

  // debounced version
  _debouncedMouseEnterHandler() {
    return _.throttle((e) => {
      // execute with a delay so that it does not interfere with existing scrolls
      _.delay(() => this._mouseEnterHandler(e), 0) 
    }, 700, {trailing: false, leading: true})
  }

  render() {

    let res = this.props.res

    return (
      <div 
        className={"card " + (this._isHighLighted(res.id) ? 'highlighted' : '')}
        // onMouseOver={(e) => this._debouncedMouseEnterHandler()(e)}
        onMouseOver={(e) => this._debouncedMouseEnterHandler()(e)}
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