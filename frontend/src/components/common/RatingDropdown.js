import React from "react";
import FiveStarRatings from "../common/FiveStarRatings";
import Dropdown from "react-bootstrap/Dropdown";

export default function RatingDropdown({ value, onChange }) {
  return (
    <Dropdown className="rating-dropdown">
      <Dropdown.Toggle variant="" id="dropdown-basic">
        {value == 0 ? "All Ratings" : <FiveStarRatings rating={value} />}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item className="pb-2" onClick={() => onChange(0)}>
          All Ratings
        </Dropdown.Item>
        {[5, 4, 3, 2, 1].map((r) => (
          <Dropdown.Item key={r} className="pb-2" onClick={() => onChange(r)}>
            <FiveStarRatings rating={r} />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
