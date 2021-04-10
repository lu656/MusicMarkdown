import React, { useRef, useEffect, useState } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

export default function OpenSheetDisplay(props) {
    const musicDisplay = useRef();
    // constructor(props) {
    //   super(props);
    //   this.state = { dataReady: false };
    //   this.osmd = undefined;
    //   this.divRef = React.createRef();
    // }
    var osmd = undefined
    const [state, setState] = useState(0);

    var setupOsmd = () => {
      const options = {
        autoResize: props.autoResize !== undefined ? props.autoResize : true,
        drawTitle: props.drawTitle !== undefined ? props.drawTitle : true,
      }
      osmd = new OSMD(musicDisplay.current, options);
      osmd.load(props.file).then(() => osmd.render());
    }

    var resize = () => {
      setState(state + 1);
    }

    // resize() {
    //   this.forceUpdate();
    // }

    useEffect(() => {
      return () => {
        window.removeEventListener('resize', resize)
      }
    }, [])
  
    // componentWillUnmount() {
    //   window.removeEventListener('resize', this.resize)
    // }

    useEffect(() => {
      if (!osmd) {
        setupOsmd();
      } else {
        osmd.clear();
        osmd = null;
        // osmd.load(props.file).then(() => osmd.render());
        setupOsmd();
      }
      window.addEventListener('resize', resize)
    }, [props])
  
    // componentDidUpdate(prevProps) {
    //   if (this.props.drawTitle !== prevProps.drawTitle) {
    //     this.setupOsmd();
    //   } else {
    //     this.osmd.load(this.props.file).then(() => this.osmd.render());
    //   }
    //   window.addEventListener('resize', this.resize)
    // }

    useEffect(() => {
      window.removeEventListener('resize', resize)
    }, [])
  
    // Called after render
    // componentDidMount() {
    //   this.setupOsmd();
    // }
  
    return (<div ref={musicDisplay} a={state}/>);
  }

  // export default OpenSheetMusicDisplay;
