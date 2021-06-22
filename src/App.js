import React, {Component} from 'react';
import Nav from './components/navigation/Navigation.js'
import Clarifai from 'clarifai';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import './App.css';

const app = new Clarifai.App({
  apiKey: '4058454fbbd640f1945bfa4e0695740a'
});

const particleOptions = {
              particles: {
                number: {
                  value: 60,
                  density: {
                    enable: true,
                    value_area: 800
                  }
                
                }
              }
              }

class  App extends Component {
  constructor () {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
    .predict( 
    Clarifai.FACE_DETECT_MODEL , 
    this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch (err=> console.log(err));
  }

  

  render() {

    const {imageUrl, box} = this.state;

    return (
      <div className="App"> 
        <Particles className="particles" params={particleOptions}/>
        <Nav/>
        <div> 
        <Logo/>
        <ImageLinkForm 
        onInputChange= {this.onInputChange}
        onButtonSubmit = {this.onButtonSubmit}  
        />
        <FaceRecognition box={box} imageUrl = {imageUrl}/>
        </div>
      </div>
      );
  }
}

export default App;  