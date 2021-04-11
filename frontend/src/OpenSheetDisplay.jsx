// import React, { useRef, useEffect, useState } from 'react';
// import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

// export default function OpenSheetDisplay(props) {
//   const musicDisplay = useRef();
//   // constructor(props) {
//   //   super(props);
//   //   this.state = { dataReady: false };
//   //   this.osmd = undefined;
//   //   this.divRef = React.createRef();
//   // }
//   var osmd = undefined;
//   const [state, setState] = useState(0);

//   var setupOsmd = () => {
//     const options = {
//       autoResize: props.autoResize !== undefined ? props.autoResize : true,
//       drawTitle: props.drawTitle !== undefined ? props.drawTitle : true,
//     };
//     osmd = new OSMD(musicDisplay.current, options);
//     osmd.load(process.env.PUBLIC_URL + '/' + props.file).then(() => osmd.render());
//   };

//   var resize = () => {
//     setState(state + 1);
//   };

//   // resize() {
//   //   this.forceUpdate();
//   // }

//   useEffect(() => {
//     return () => {
//       window.removeEventListener('resize', resize);
//     };
//   }, []);

//   // componentWillUnmount() {
//   //   window.removeEventListener('resize', this.resize)
//   // }

//   useEffect(() => {
//     console.log(props);
//     console.log('refreshing osmd');
//     console.log(osmd);
//     try {
//       osmd.clear();
//       setupOsmd();
//     } catch (error) {}

//     window.addEventListener('resize', resize);
//   }, [props, osmd]);

//   // componentDidUpdate(prevProps) {
//   //   if (this.props.drawTitle !== prevProps.drawTitle) {
//   //     this.setupOsmd();
//   //   } else {
//   //     this.osmd.load(this.props.file).then(() => this.osmd.render());
//   //   }
//   //   window.addEventListener('resize', this.resize)
//   // }

//   useEffect(() => {
//     window.removeEventListener('resize', resize);
//   }, []);

//   // Called after render
//   // componentDidMount() {
//   //   this.setupOsmd();
//   // }

//   return <div ref={musicDisplay} a={state} />;
// }

// // export default OpenSheetMusicDisplay;

import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { dataReady: false };
    this.osmd = undefined;
    this.divRef = React.createRef();
    this.xmlContent = localStorage.getItem('parsedResult');
    if (this.xmlContent === null || this.xmlContent === undefined) {
      this.xmlContent = '';
    }
    console.log(this.xmlContent);
  }

  componentWillReceiveProps() {
    console.log('Sheet componenet updated');
    console.log(this.props);
  }

  setupOsmd() {
    const options = {
      autoResize: this.props.autoResize !== undefined ? this.props.autoResize : true,
      drawTitle: this.props.drawTitle !== undefined ? this.props.drawTitle : true,
    };
    this.osmd = new OSMD(this.divRef.current, options);
    // this.osmd.load(process.env.PUBLIC_URL + '/' + this.props.file).then(() => this.osmd.render());
    this.osmd.load(this.props.content).then(() => this.osmd.render());
  }

  resize() {
    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.drawTitle !== prevProps.drawTitle) {
      this.setupOsmd();
    } else {
      // this.osmd.load(process.env.PUBLIC_URL + '/' + this.props.file).then(() => this.osmd.render());
      this.osmd.load(this.props.content).then(() => this.osmd.render());
    }
    window.addEventListener('resize', this.resize);
  }

  // Called after render
  componentDidMount() {
    try {
      this.osmd.clear();
    } catch (error) {}
    this.setupOsmd();
  }

  render() {
    return <div ref={this.divRef} />;
  }
}

export default OpenSheetMusicDisplay;
