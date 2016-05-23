import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

// Models
import Timer from './models/Timer';

// Global styles
import { styles } from './styles/app.scss';


const AppTimer = new Timer();

@observer
class App extends Component {
  static propTypes = {
    Timer: PropTypes.object,
  }

  resetTimer = () => {
    this.props.Timer.resetTimer();
  }

  render() {
    return (
      <section className={`${styles}`}>
        <button onClick={this.resetTimer}>
          Seconds elapsed: {this.props.Timer.timer}
        </button>
        <DevTools />
      </section>
    );
  }
}

ReactDOM.render(<App Timer={AppTimer} />, document.getElementById('app'));
