import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

class BookList extends React.Component {
  
  deleteBook = id => {
    let confirmDelete = window.confirm('Delete book permanently?')
    if(confirmDelete){
      fetch(`${process.env.REACT_APP_REST_API_URL}/book/${id}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(item => {
        this.props.deleteBookFromState(id);
      })
      .catch(err => console.log(err))
    }

  }

  renderAvailability = (availability) => {
    switch(availability) {
      case 'available': 
        return <div className="badge badge-success">Available</div>;
      case 'pending': 
        return <div className="badge badge-warning">Pending</div>;
      case 'sold': 
        return <div className="badge badge-danger">Sold</div>;
      default:
        return <div className="badge badge-light">Pending</div>;
    }
  }

  render() {
    let items = [];
      if (!this.props.items || this.props.items.length === 0) {
        return (
          <div className="h5">No data available</div>
        ); 
      } else {
        items = this.props.items.map(item => {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.isbn}</td>
            <td>{item.name}</td>
            <td>{item.price} €</td>
            <td>{item.author.name}</td>
            <td>
              {this.renderAvailability(item.availability)}
            </td>
            <td className="text-right">
              <Link to={`/book/${item.id}`}>
                <button className="btn btn-link" type="button">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </Link>
              <button className="btn btn-link " type="button"
                onClick={() => this.deleteBook(item.id)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </td>
          </tr>
        )
      })
    }
      

    return (
      <>
        <div className="mb-2 text-right">
          <Link to="/book/new">
            <button className="btn btn-outline-primary">
              Add new
            </button>
          </Link>
        </div>
        <div className="">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ISBN</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Author</th>
                  <th scope="col">Availability</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </table>
          </div>
        </div>
      </>
        
      
    );
  }
}

BookList.propTypes = {
  items: PropTypes.array.isRequired,
  deleteBookFromState: PropTypes.func.isRequired,
};
export default BookList;
