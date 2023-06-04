import React, { useState, useEffect } from "react";
import { fetchRestaurants } from "../../services";
import Pagination from "../common/Pagination";
import StarRatingDropdown from "../common/RatingDropdown";
import FiveStarRatings from "../common/FiveStarRatings";

export default function Restaurants({ history }) {
  const [restaurants, setRestaurants] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState(0);

  async function fetchData() {
    try {
      const data = await fetchRestaurants({
        page,
        perPage,
        query,
        rating: ratingFilter,
      });
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
  }, [page, perPage, query, ratingFilter]);

  const onClickRestaurant = (restaurantId) => {
    history.push(`/restaurants/${restaurantId}`);
  };

  const pageCount = Math.floor(total / perPage) + 1;

  const renderTable = () => {
    return (
      <div className="row restaurant-list">
        {restaurants &&
          restaurants.map((restaurant, idx) => (
            <div
              className="restaurant-item cursor-pointer col-12 border my-1 py-3"
              key={restaurant.id}
              onClick={() => onClickRestaurant(restaurant.id)}
            >
              <h6 className="my-0">{restaurant.name}</h6>
              <div className="mb-1">
                <FiveStarRatings rating={restaurant.rating || 0} />{" "}
                <span
                  className="text-secondary ml-2 small"
                  style={{ position: "relative", top: "3px" }}
                >
                  {restaurant.reviewCount} Reviews
                </span>
              </div>

              <div className="text-secondary">{restaurant.description}</div>
              <div className="small text-secondary pt-2">
                <span className="text-dark">Location: </span>
                {restaurant.location}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div>
            <h4 className="pt-2">All Restaurants</h4>
            <div className="clearfix pt-3">
              <div className=" float-left form-group has-search mr-4">
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
              <StarRatingDropdown
                value={ratingFilter}
                onChange={(r) => {
                  setRatingFilter(r);
                  setPage(1);
                }}
              />
            </div>
          </div>
          <div className="">
            <div className="">{renderTable()}</div>

            {!fetchError && loaded && restaurants.length === 0 && (
              <div className="">No restaurants found</div>
            )}
          </div>

          <div className="mt-4">
            <div className="float-right">
              <Pagination
                perPage={perPage}
                page={page}
                total={total}
                onChange={(p) => setPage(p)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
