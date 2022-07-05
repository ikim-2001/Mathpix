import Dropzone from "react-dropzone";
import React, {Component} from "react";
import dnd from "./resources/dropzone.png";
import dndgood from "./resources/dropzone-good.png";
import dndbad from "./resources/dropzone-bad.png";



class App extends Component{
  constructor(props){
    super(props);
    this.ocrValue = "Not Run";
    this.onAcceptedDrop = this.onAcceptedDrop.bind(this);
    this.getBase64 = this.getBase64.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.state={
      base64: ""
    }
  }

  async getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
      cb(reader.result);
    }
    reader.onerror = function(error){
      console.log("error:", error)
    }
  }

  async fileUpload(file){
    try{
      await this.getBase64(file, (base64string) => {
        fetch("https://api.mathpix.com/v3/text", {
          method: "POST", 
          headers:{
            "content-type": "application/json",
            "app_id": "jake_renota_app_657efb_b916f4", // eventually have this in backend
            "app_key": "b15f4d46899e57cf633f8978df73cf6fc161ba55c2e01791751d50c19edb54a4",
          },
          body: JSON.stringify({
            src: base64string,
            formats: ["text", "data", "html"],
            data_options: {
              include_asciimath: true,
            }
          })
        })
        .then((res) => res.json())
        .then((response) => outputOCR(response["data"]))
        .then((response) => console.log(response["data"]))
      })
      
    } catch(e){
      console.log(e.message);
    }

  }
  
  async onAcceptedDrop(acceptedFile){
    await this.fileUpload(acceptedFile[0])
  }

  
  render(){
    return(
      <div><Dropzone
      minSize={1}
      maxSize={5000000}
      accept="imag/png, image/jpeg, image/webp, image/tiff"
      maxFiles={1}
      noKeyboard={true}
      onDrop={file => console.log(file)}
      onDropAccepted={this.onAcceptedDrop}
      onDropRejected={() => console.log("bad file")}>
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragReject
        }) => {
          return(
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {!isDragActive && (<img src={dnd} alt="dnd"/>)}
              {isDragActive && !isDragReject && (<img src={dndgood} alt="good"/>)}
              {isDragActive && isDragReject && (<img src={dndbad} alt="bad"/>)}
            </div>
          )
        }}
        
        </Dropzone>
        <img src={this.state.base64} alt='base64' />
        {this.ocrValue}
        </div>
    );
  }
}

function outputOCR(lst) {
  document.write("<div>OUTPUT INFO:<div>")
  for (let i = 0; i < lst.length; i++) {
    document.write(lst[i]["value"])
    document.write("<br>");
  }
  return 0;
}


export default App;
