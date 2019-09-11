import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

const AddEditForm = lazy(() => import('./Components/AddEditForm'));
const BookList = lazy(() => import('./Components/BookList'));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
    };
  }

  deleteBookFromState = (id) => {
    const updatedItems = this.state.items.filter(item => item.id !== id)
    this.setState({ items: updatedItems })
  }

  addBookToState = (item) => {
    this.setState(prevState => ({
      items: [...prevState.items, item]
    }))
  }

  updateState = (item) => {
    const index = this.state.items.findIndex(data => data.id === item.id);
    const bookList = [
      ...this.state.items.slice(0, index),
      item,
      ...this.state.items.slice(index + 1)
    ];
    this.setState({ items: bookList });
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
        <div className="container bg-white my-5 p-5">
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={() => <BookList items={this.state.items} deleteBookFromState={this.deleteBookFromState} />}/>
                <Route path="/book/:id" render={(props) => <AddEditForm {...props} addBookToState={this.addBookToState} updateState={this.updateState}/>}/>
              </Switch>
            </Suspense>
          </Router>
        </div>
      </div>
    )
  }

}

export default App;
