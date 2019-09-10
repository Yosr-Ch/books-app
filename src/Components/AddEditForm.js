import React from 'react';
import Select from 'react-select';

const options = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending'},
  { value: 'sold', label: 'Sold'},
];

class AddEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isbn: '',
      name: '',
      price: 0,
      author: {
        name: ''
      },
      availability: '',
      selectedOption: null,
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit = (e) => {
    
  }

  handleChange = e => {
    console.log('ev', e);
    
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSelectChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  componentDidMount(){
    // if item exists, populate the state with proper data
    // console.log(this.props.match.params);
    const bookId = this.props.match.params.id;
    if (bookId !== 'new') {
      fetch(`${process.env.REACT_APP_REST_API_URL}/book/${bookId}`)
      .then(response => response.json())
      .then(({ id, isbn, name, price, author, availability }) => {
        this.setState({ id, isbn, name, price, author, selectedOption: availability });
      })
      .catch(err => console.log(err))
    }
  }

  render() {
    return (
      <div>
        <p>hey</p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input id="isbn"
              type="text"
              className="form-control"
              onChange={this.handleChange}
              value={this.state.isbn}/>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name"
              type="text"
              className="form-control"
              onChange={this.handleChange}
              value={this.state.name}/>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input id="price"
              type="number"
              className="form-control"
              onChange={this.handleChange}
              value={this.state.price}/>
          </div>
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input id="author"
              type="text"
              className="form-control"
              onChange={this.handleChange}
              value={this.state.author.name}/>
          </div>
          <div className="form-group">
            <label htmlFor="availability">Availability</label>
            {/* <input id="availability"
              type="text"
              className="form-control"
              onChange={this.handleChange}
              value={this.state.availability}/> */}
              {/* <select id="availability" name={this.state.availability}
                className="form-control"
                value={this.state.availability}
                onChange={this.handleChange}>
                {this.state.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.displayValue}
                  </option>
                ))}
              </select> */}
              <Select id="availability"
                value={this.state.selectedOption}
                onChange={this.handleSelectChange}
                options={options}
              />
          </div>
          
        </form>
      </div>
      
    );
  }
}
export default AddEditForm;
