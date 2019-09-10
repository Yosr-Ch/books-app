import React, { Suspense, lazy } from 'react';
// import logo from './logo.svg';
import './App.css';
// import BookList from './Components/BookList';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const AddEditForm = lazy(() => import('./Components/AddEditForm'));
const BookList = lazy(() => import('./Components/BookList'));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
    };
  }

  getItems(){
    fetch(`${process.env.REACT_APP_REST_API_URL}/book`)
      .then(response => response.json())
      .then(items => this.setState({items}))
      .catch(err => console.log(err))
  }

  componentDidMount(){
    this.getItems()
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={() => <BookList items={this.state.items} />}/>
                <Route path="/book/:id" component={AddEditForm}/>
              </Switch>
            </Suspense>
          </Router>
        </div>
      </div>
    )
  }

}

export default App;
