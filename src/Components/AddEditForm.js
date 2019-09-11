import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending'},
  { value: 'sold', label: 'Sold'},
];
const validISBNRegex = new RegExp('^[0-9]+$');

class AddEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: this.props.match.params.id,
      isbn: '',
      name: '',
      price: 0,
      author: {
        name: ''
      },
      availability: '',
      selectedStatus: { label: '', value: '' },
      selectedAuthor: { label: '', value: '' },
      authorOptions: [],

      submitted: false,
      errors: {
        isbn: 'ISBN is required', name: 'Name is required'
      },
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
    const { bookId, isbn, name, price, author, availability, errors } = this.state;
    const valid = Object.keys(errors).every(key => !errors[key])
    const method = bookId === 'new' ? 'post' : 'put';
    const url = `${process.env.REACT_APP_REST_API_URL}/book${bookId !== 'new' ? `/${bookId}` : ''}`;
    const data = {
      isbn,
      name,
      price,
      author,
      availability, 
    };
    if (valid) {
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(item => {
        if (bookId === 'new') {
          this.props.addBookToState({...{ id: item.book_id}, ...data});
        } else {
          this.props.updateState({...{ id: item.book_id}, ...data})
        }
        this.props.history.push('/');
        this.props.history.goForward();
      })
      .catch(err => console.log(err))
    }
  }

  handleChange = e => {
    let errors = this.state.errors;
    const { name, value } = e.target;

    switch (name) {
      case 'isbn': 
        errors.isbn = 
          !value.length 
            ? 'ISBN is required'
            : (value.length !== 13
              ? 'ISBN must be 13 numbers long!'
              : (!validISBNRegex.test(value)
                  ? 'ISBN must contain only numbers!'
                  : ''
                ));
        break;
      case 'name': 
        errors.name = 
          !value.length
            ? 'Name is required!'
            : '';
        break;
      default:
        break;
    }
    this.setState({ errors, [name]: name === 'price' ? parseFloat(value) : value });
  }

  handleSelectChange = selectedStatus => {    
    this.setState({ selectedStatus, availability: selectedStatus.value });
    console.log(`Option selected:`, selectedStatus);
  };

  handleAuthorChange = (newValue, actionMeta) => {
    if (newValue) {
      const { value, label } = newValue;
      this.setState({
        author: { name: label, id: value },
        selectedAuthor: { label, value },
      });
    }
  };

  getAuhtors() {
    fetch(`${process.env.REACT_APP_REST_API_URL}/author`)
      .then(response => response.json())
      .then(items => {
        const authorOptions = items.map(({ id, name }) => { return { value: id, label: name }})
        this.setState({ authorOptions });
      })
      .catch(err => console.log(err))
  }

  getBookById(bookId) {
    if (bookId !== 'new') { // edit book
      fetch(`${process.env.REACT_APP_REST_API_URL}/book/${bookId}`)
      .then(response => response.json())
      .then(({ id, isbn, name, price, author, availability }) => {
        const label = `${availability.charAt(0).toUpperCase()}${availability.slice(1)}`;
        this.setState({
          id, isbn, name, price, author, availability,
          selectedStatus: { value: availability, label },
          selectedAuthor: { value: author.id, label: author.name },

          errors: { isbn: `${!isbn ? 'ISBN is required': ''}`, name: `${!name ? 'Name is required': ''}` }
        });
      })
      .catch(err => console.log(err))
    }
  }

  componentDidMount(){
    // console.log(this.props.match.params);
    const bookId = this.state.bookId;
    this.getBookById(bookId);
    this.getAuhtors();
  }

  render() {
    const { isbn, name, price, selectedStatus, authorOptions, selectedAuthor, errors, submitted } = this.state;
    
    return (
      <div>
        <div>
          {this.state.bookId === 'new' ? (
            <div className="h3">New Book</div>
          ) : (
            <div className="h3">Edit Book</div>
          )}
        </div>
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input id="isbn" name="isbn"
              type="text"
              className={`form-control ${submitted && errors.isbn ? "is-invalid " : ""} `}
              onChange={this.handleChange}
              value={isbn} 
              maxLength="13" required/>
            <div className="invalid-feedback">
              {errors.isbn}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name"
              type="text"
              className={`form-control ${submitted && errors.name ? "is-invalid " : ""} `}
              onChange={this.handleChange}
              value={name} required/>
            <div className="invalid-feedback">
              {errors.name}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <div className="input-group mb-3">
              <input id="price" name="price"
                type="number"
                className="form-control"
                onChange={this.handleChange}
                value={price} min="0"/>
              <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2">€</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <CreatableSelect
              isClearable
              onChange={this.handleAuthorChange}
              value={selectedAuthor}
              options={authorOptions}
            />
          </div>
          <div className="form-group">
            <label htmlFor="availability">Availability</label>
            <Select id="availability" name="availability"
              value={selectedStatus}
              onChange={this.handleSelectChange}
              options={statusOptions}
              isSearchable={false}
            />
          </div>
          <div className="text-right">
            <button className="btn btn-outline-secondary mr-1" type="reset"
              onClick={() => this.props.history.goBack()}>
              Cancel
            </button>
            <button className="btn btn-success" type="submit">
              Save
            </button>
          </div>
          
        </form>
      </div>
      
    );
  }
}

AddEditForm.propTypes = {
  addBookToState: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
};

export default AddEditForm;
