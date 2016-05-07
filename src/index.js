import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

const appState = new class AppState {
  @observable timer = 0;

  constructor() {
    setInterval(() => {
      appState.timer += 1;
    }, 1000);
  }

  resetTimer() {
    this.timer = 0;
  }
}();

@observer
class App extends Component {
  static propTypes = {
    appState: PropTypes.object,
  }

  onReset = () => {
    this.props.appState.resetTimer();
  }

  render() {
    return (
      <div>
        <button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>
        <DevTools />
      </div>
    );
  }
}

ReactDOM.render(<App appState={appState} />, document.getElementById('app'));
