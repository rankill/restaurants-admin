import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import FiveStarRatings from "../common/FiveStarRatings";
import { Link } from "react-router-dom";
import { Role } from "../../config/constants";
import { fetchRestaurants, deleteRestaurant } from "../../services";
import ConfirmDialog from "../common/ConfirmDialog";
import { useAuthState } from "../../contexts/AuthContext";

export default function ManageRestaurants({ history }) {
  const [restaurants, setRestaurants] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const { authRole } = useAuthState();

  async function fetchData() {
    try {
      const data = await fetchRestaurants({ page, perPage, query });
      setRestaurants(data.restaurants);
      setTotal(data.total);
      setPage(data.page);
      setLoaded(true);
    } catch (e) {
      setFetchError(e.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [page, perPage, query]);

  const onClickRestaurant = (restaurantId) => {
    history.push(`/restaurants/${restaurantId}`);
  };

  const onDelete = async (event, restaurantId) => {
    event.stopPropagation();
    setSelectedId(restaurantId);
    setDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    setDialogOpen(false);
    try {
      await deleteRestaurant(selectedId);
      fetchData();
    } catch (e) {}
  };

  const startIndex = Math.min(perPage * (page - 1) + 1, total);
  const endIndex = Math.min(startIndex + perPage - 1, total);

  const renderTable = () => {
    return (
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Location</th>
            {authRole === Role.Admin && <th>Owner</th>}
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {restaurants &&
            restaurants.map((restaurant, idx) => (
              <tr
                className="cursor-pointer"
                key={restaurant.id}
                onClick={() => onClickRestaurant(restaurant.id)}
              >
                <th>{startIndex + idx}</th>
                <td className="">
                  {restaurant.name}
                </td>
                <td>{restaurant.description}</td>
                <td>{restaurant.location}</td>
                {authRole === Role.Admin && <td>{restaurant.owner.name}</td>}
                <td>
                  <FiveStarRatings rating={restaurant.rating || 0} />{" "}
                  {restaurant.rating && (
                    <span
                      className="text-secondary ml-2"
                      style={{ position: "relative", top: "5px" }}
                    >
                      {restaurant.rating.toFixed(1)}
                    </span>
                  )}
                </td>
                <td>
                  <Link
                    className="btn text-secondary"
                    to={`/restaurants/${restaurant.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fas fa-edit"></i>
                  </Link>
                  <a
                    className="btn text-secondary"
                    onClick={(e) => {
                      onDelete(e, restaurant.id);
                    }}
                  >
                    <i className="far fa-trash-alt"></i>
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="pt-2">Manage Restaurants</h4>
              <div className="clearfix pt-3">
                {authRole === Role.Owner && (
                  <div className="bs-bars float-right">
                    <div id="toolbar">
                      <Link className="btn btn-primary" to="/restaurants/new">
                        Add new restaurant
                      </Link>
                    </div>
                  </div>
                )}

                <div className=" float-left form-group has-search">
                  <span className="fa fa-search form-control-feedback"></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="">{renderTable()}</div>

              {!fetchError && loaded && restaurants.length === 0 && (
                <div className="text-center">No restaurants found</div>
              )}
            </div>
            <div className="card-footer">
              <div className="float-right"></div>

              <Pagination
                page={page}
                perPage={perPage}
                total={total}
                onChange={(p) => setPage(p)}
              />
              <div className="float-right mx-4 mt-2">
                Showing ({startIndex} - {endIndex}) / {total}
              </div>
              <div className="float-right mr-2 mt-1">
                Show per page &nbsp;
                <select
                  className="form-control-sm"
                  value={perPage}
                  onChange={(event) => {
                    setPerPage(parseInt(event.target.value));
                    setPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        show={dialogOpen}
        text="Are you sure you want to delete this restaurant?"
        onConfirm={onConfirmDelete}
        onHide={() => setDialogOpen(false)}
      />
    </div>
  );
}
