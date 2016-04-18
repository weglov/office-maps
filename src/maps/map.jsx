var React = require('react');
var Float = require('./floats/float');
var Zoom = require('./zoom');
var Tooltip = require('./tooltip');
var Controls = require('./controls');
var Config = require('.././config');
var Search = require('./search');
var Api = require('../data/api');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      float: 2,
      active: true,
      zone: 0,
      elem: []
    }
  },
  getDefaultProps:  function() {
      return {
        float: 2
      }
  },
  _updateMaps: function() {
    $("polygon, path").mouseenter(function() {
      $(this).addClass('active');
    });
    $("polygon, path").mouseleave(function() {
        $(this).removeClass('active');
    });
    $('text').mouseenter(function() {
      var id = $(this).parents().attr("id").slice(2);
      if (id) {
        $("polygon#zone" + id + ", path#zone" + id).addClass('active');
      }
    });
    $('text').mouseleave(function() {
      var id = $(this).parents().attr("id").slice(2);
      $("polygon#zone" + id+", path#zone" + id).removeClass('active');
    });
    var $pep = $('#drag').pep();
    // Drag init
  },
  _selectZone: function(zone) {
    $("polygon.active_zone, path.active_zone").removeClass('active_zone');
    $("polygon#zone" + zone +", path" + zone).addClass('active_zone');
  },
  componentDidMount: function() {
    this._updateMaps();
  },
  componentDidUpdate: function() {
    if (this.state.zone != 0) {
      this._selectZone(this.state.zone);
    }
    $("polygon, path").click(function() {
      var id = $(this).attr("id").slice(4);
      Api.get('zonelist/zone/' + id)
        .then(function(json){
          self.setState({elem: json})
        }.bind(self));
    });

    this._updateMaps();
    var self = this;
    setTimeout(function() {
      self.setState({active: true})
    }, 100);
  },
  componentWillReceiveProps: function() {
     this.setState({active: true});
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (nextState.elem !== this.state.elem) {
      return true
    } else if (nextState.active == this.state.active && nextState.elem == this.state.elem) {
      return false
    } else {
      return true;
    }

    // return nextState.active !== this.state.active;
  },
  _updateFloat: function(e) {
    this.setState({
      float: e,
      active: false
    });
  },
  _activeZone: function(e, float) {
    this.setState({
      zone: e
    });
    this._updateFloat(float);
  },
  render: function() {
    var float_size = 'float' + this.state.float;
    return (
      <div id="map" ref="map" className="map">
        <Zoom />
        <Tooltip elem={this.state.elem} />
        <Search activeZone={this._activeZone}/>
        <svg onLoad={this._loaderMaps} viewBox={'0 0 ' + Config[float_size].width + ' ' + Config[float_size].height} className={this.state.active ? 'fade-in' : ''} >
          <g id="zoom" ref="zoom">
            <Float content={this.state.float}/>
          </g>
        </svg>
        <Controls float={this.state.float} changeFloat={this._updateFloat} />
      </div>
    )
  }
})
