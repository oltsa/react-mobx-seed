import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import Timer from './models/Timer';

const AppTimer = new Timer();

@observer
class App extends Component {
  static propTypes = {
    Timer: PropTypes.object,
  }

  onReset = () => {
    this.props.Timer.resetTimer();
  }

  render() {
    return (
      <div>
        <button onClick={this.onReset}>
          Seconds: {this.props.Timer.timer}
        </button>
        <DevTools />
      </div>
    );
  }
}

ReactDOM.render(<App Timer={AppTimer} />, document.getElementById('app'));
