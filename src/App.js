import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {
  state = {
    isConnected:false,
    old_messages:[],
    message:{
      text: null,
      id:null,
      name: 'Fatima B'
    }
  }
  socket = null

  componentWillMount(){

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('youare',(answer)=>{
      this.setState(prevState => ({
        message: {                   
            ...prevState.message, 
            id:answer.id
          }}
            ))
    })
    // this.socket.on('peeps', clients => this.setState({peeps: clients}))
    // this.socket.on('new connection', id => this.state.peeps.push(id))
    // this.socket.on('new disconnection', id => 
    // this.state.peeps.splice(this.state.peeps.findIndex(function(i){
    //   return i === id;
    // }), 1))
    this.socket.on('next',(message_from_server)=>console.log(message_from_server))

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })
    // this.socket.on('pong!',(additionalStuff)=>{
    //   console.log('server answered!', additionalStuff)
    // })
    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })

    /** this will be useful way, way later **/
    this.socket.on('room', old_messages => this.setState({old_messages:old_messages}))
    // this.socket.on('room', old_messages => console.log(old_messages))

  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  render() {
    return (<div className="App">
      <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
      {/* add: */}
      <div>id: {this.state.id}</div>
      <div>Connected:  </div>
      {this.state.old_messages.map(item => (
            <ul>
            <li key={item}>date:{' ' + item.date + ' '}</li>
            <li key={item}>name:{' ' +  item.name + ' '} text:{' ' + item.text}</li>

            </ul>
            ))}
            {/* <div>number of connections: {this.state.peeps.length}</div>
      <button onClick={()=>this.socket.emit('ping!')}>ping</button> */}
      {/* and also add: */}
      <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button>
      {/* <button onClick={()=>this.socket.emit("give me next")}>Give me next</button>
      <button onClick={() => this.socket.emit("hint:addition")}> add </button> */}
      <input type={String}  onChange={(e)=>{this.setState(prevState => ({
  message: {                   
      ...prevState.message,   
      text:   e.target.value,
      // id: this.state.id     
  }
}))}}></input>
      <button onClick={()=>this.socket.emit('message', this.state.message)}>Message</button>    
    </div>);
  }
}

export default App;
