import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        todoList:[],
        activeItem:{
          id:null,
          title:'',
          complated:false,
        },
        editing:false,
      }
      this.fetchTask = this.fetchTask.bind(this)
      this.handlChagne = this.handlChagne.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.getCookie = this.getCookie.bind(this)
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
  
  componentWillMount(){
    this.fetchTask()
  }

  fetchTask(){
    console.log('Fetching...')

    fetch('http://127.0.0.1:8000/api/task-list/')
    .then(Response => Response.json())
    .then(data =>
      this.setState({
        todoList:data
      })
    )
  }

  handlChagne(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')

    var url = 'http://127.0.0.1:8000/api/task-create/'
    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTask()
      this.setState({
        activeItem:{
          id:null,
          title:'',
          complated:false,
        }
      })
    }).catch(function(error){
      console.log('ERROR:', error)
    }
    )
  }

  render(){
    var task = this.state.todoList
    return(
        <div className="container">

          <div id="task-container">
            <div id="form-wrapper">
              <form onSubmit={this.handleSubmit} id="form">
                <div className="flex-wrapper">
                  <div style={{flex: 6}}>
                    <input onChange={this.handlChagne}  className="form-control" id="title" type="text" value={this.state.activeItem.title} name="title" placeholder='Add task'/>
                  </div>
                  
                  <div style={{flex: 1}}>
                    <input id="submit" className="btn btn-warning" type="submit" name="Add"/>
                  </div>
                </div>
              </form>

            </div>
            <div id="list-wrapper">
                {task.map(function(task, index){
                  return(
                    <div key={index} className="task-wrapper flex-wrapper">
                      
                      <div style={{flex:7}}>
                        <span>{task.title}</span>
                      </div>

                      <div style={{flex:1}}>
                        <button className="btn btn-sm btn-outline-info">Edit</button>
                      </div>

                      <div style={{flex:1}}>
                      <button className="btn btn-sm btn-outline-dark delete">-</button>
                      </div>

                    </div>
                  )
                })}
            </div>
          </div>

        </div>
    )
  }
}

export default App;
