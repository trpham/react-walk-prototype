import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Joyride from 'react-joyride';
import './react-joyride-compiled.css';
import './styles.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      autoStart: false,
      running: true,
      steps: [
        {
          title: "Click on Tab 1 to start",
          textAlign: 'center',
          selector: '.tab1',
          position: 'top'
        },
        {
          title: "Click on Box 1",
          textAlign: 'center',
          selector: '.box1',
          position: 'top'
        }, 
        {
          title: "Click on Box 2",
          textAlign: 'center',
          selector: '.box2',
          position: 'top'
        }
      ],
      step: 0,
    };

    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
    this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this);
  }
  
  static propTypes = {
    joyride: React.PropTypes.shape({
      autoStart: React.PropTypes.bool,
      callback: React.PropTypes.func,
      run: React.PropTypes.bool,
    })
  }

static defaultProps = {
    joyride: {
      autoStart: false,
      resizeDebounce: false,
      run: false,
    },
  };

//  componentDidMount() {
//     this.joyride.addTooltip({
//       title: 'Tab 1',
//       text: 'Click on Tab 1',
//       selector: '.tab1',
//       position: 'bottom',
//       event: 'click',
//       style: {
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         borderRadius: 0,
//         color: '#fff',
//         mainColor: '#ff67b4',
//         textAlign: 'center',
//         width: '29rem'
//       }
//     });
//   }

  handleClickStart(e) {
    e.preventDefault();

    this.setState({
      running: true,
      step: 0,
    });
  }

  handleNextButtonClick() {
    if (this.state.step === 1) {
      this.joyride.next();
    }
  }

  handleJoyrideCallback(result) {
    const { joyride } = this.props;

    if (result.type === 'step:before') {
      // Keep internal state in sync with joyride
      this.setState({ step: result.index });
    }

    if (result.type === 'finished' && this.state.running) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ running: false });
    }

    if (result.type === 'error:target_not_found') {
      this.setState({
        step: result.action === 'back' ? result.index - 1 : result.index + 1,
        autoStart: result.action !== 'close' && result.action !== 'esc',
      });
    }

    if (typeof joyride.callback === 'function') {
      joyride.callback();
    }
  }

  render() {

    const { joyride } = this.props;
    const joyrideProps = {
      autoStart: joyride.autoStart || this.state.autoStart,
      callback: this.handleJoyrideCallback,
      debug: false,
      disableOverlay: this.state.step === 1,
      resizeDebounce: joyride.resizeDebounce,
      run: joyride.run || this.state.running,
      scrollToFirstStep: joyride.scrollToFirstStep || true,
      stepIndex: joyride.stepIndex || this.state.step,
      steps: joyride.steps || this.state.steps,
      type: joyride.type || 'continuous'
    };

    return (
      <div className="App">

        <Joyride
          {...joyrideProps}
          ref={c => (this.joyride = c)} />

          <Tabs>
					<TabList>
						<Tab className="tab1" >Tab 1</Tab>
						<Tab className="tab2" >Tab 2</Tab>
					</TabList>

					<TabPanel>
						<h2 className="box1" >Box 1</h2>
						<h2 className="box2" >Box 2</h2>
					</TabPanel>
					<TabPanel>
						<h2 className="box3">Box 3</h2>
						<h2 className="box4">Box 4</h2>
					</TabPanel>
				</Tabs>

      </div>
    );
  }
}

export default App;
