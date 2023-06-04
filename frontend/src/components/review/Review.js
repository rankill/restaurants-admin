import React, { useState, useEffect } from "react";
import FiveStarRatings from "../common/FiveStarRatings";
import ReviewForm from "./ReviewForm";
import moment from "moment-timezone";
import { updateReview } from "../../services";
import { Link } from "react-router-dom";
import { useAuthState } from "../../contexts/AuthContext";

export default function Review({
  editable = false,
  review,
  onUpdated,
  onDelete,
  showRestaurant = false,
}) {
  const [editing, setEditing] = useState(false);
  const [updateReviewError, setUpdateReviewError] = useState(null);
  const { authUser } = useAuthState();
  let userName = review.user.name;
  if (authUser && authUser.id === review.user.id) {
    userName = <b>me</b>;
  }

  const onCancelEditing = () => {
    setEditing(false);
  };

  const onUpdateReview = async (data) => {
    try {
      const updated = await updateReview(review.id, data);
      onUpdated(updated);
      setEditing(false);
    } catch (e) {
      setUpdateReviewError(e.message);
    }
  };

  return editing ? (
    <ReviewForm
      review={review}
      onSubmit={onUpdateReview}
      onCancel={onCancelEditing}
      error={updateReviewError}
      title="Edit your review"
    />
  ) : (
    <div className="pt-1">
      {editable && (
        <div className="float-right">
          <a
            className="btn text-secondary px-1"
            onClick={(e) => setEditing(!editing)}
          >
            <i className="fas fa-edit"></i>
          </a>
          <a
            className="btn text-secondary px-1"
            onClick={(e) => {
              onDelete(review.id);
              setEditing(false);
            }}
          >
            <i className="far fa-trash-alt"></i>
          </a>
        </div>
      )}
      <FiveStarRatings rating={review.rating} />{" "}
      <span
        className="small text-secondary ml-3"
        style={{ position: "relative", top: "3px" }}
      >
        Reviewed {moment(review.createdAt).fromNow()}
      </span>
      <div className="my-1">
        {(review.comment || "").split("\n").map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
      <div className="small text-secondary">Reviewed by {userName}</div>
      <div className="small text-secondary">
        <span className="text-secondary">Visited on </span>
        {moment(review.visitDate).format("MMMM D YYYY")}
      </div>
      {showRestaurant && (
        <Link className="" to={`/restaurants/${review.restaurant.id}`}>
          {review.restaurant.name}
        </Link>
      )}
    </div>
  );
}
