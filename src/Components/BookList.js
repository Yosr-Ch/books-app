import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { Link } from "react-router-dom";

class BookList extends React.Component {
  
  render() {
    let items = [];
      if (!this.props.items || this.props.items.length === 0) {
        return (
          <Link to="/book/new">Show the Form</Link>
        ); 
      } else {
        items = this.props.items.map(item => {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.isbn}</td>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>{item.author.name}</td>
            <td>{item.availability}</td>
            <td>
              <Link to={`/book/${item.id}`}>
                <button className="btn btn-sm btn-primary mr-1" type="submit">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </Link>
              <button className="btn btn-sm btn-danger" type="submit">
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </td>
          </tr>
        )
      })
    }
      

    return (
      <div>
        <div className="row">
          <Link to="/book/new">
            <button className="btn btn-primary">
              Add new
            </button>
          </Link>
        </div>
        <div className="row">
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
      </div>
        
      
    );
  }
}
export default BookList;
