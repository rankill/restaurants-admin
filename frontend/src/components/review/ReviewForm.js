import React, { useState, useEffect } from "react";
import FiveStarRatings from "../common/FiveStarRatings";
import DatePicker from "react-datepicker";

export default function ReviewForm({
  review,
  onSubmit,
  onCancel,
  error,
  title,
}) {
  const [rating, setRating] = useState(review ? review.rating : 0);
  const [comment, setComment] = useState(review ? review.comment : "");
  const [formError, setFormError] = useState(null);
  const [visitDate, setVisitDate] = useState(
    review ? new Date(review.createdAt) : new Date()
  );

  useEffect(() => {
    setFormError(error);
  }, [error]);
  const onChangeRating = (newRating) => {
    setRating(newRating);
  };

  const onChangeComment = (e) => {
    setComment(e.target.value);
  };

  const submitForm = (e) => {
    if (rating === 0) {
      setFormError("Please select rating.");
    } else if (comment.length == 0) {
      setFormError("Please input comment.");
    } else if (!visitDate) {
      setFormError("Please select visited date.");
    } else if (visitDate > new Date()) {
      setFormError("Visit date can't be later than today.");
    } else {
      onSubmit({ rating, comment, visitDate });
    }
  };

  return (
    <div>
      <h6 className="">{title}</h6>
      <FiveStarRatings rating={rating} changeRating={onChangeRating} />

      <div className="mt-2">
        <textarea
          className="form-control"
          rows="2"
          value={comment}
          onChange={onChangeComment}
        />
      </div>

      <div className="mt-2">
        <div>
          <label className="small text-secondary">Visit date</label>
        </div>

        <DatePicker
          selected={visitDate}
          className="form-control"
          onChange={(date) => setVisitDate(date)}
          onSelect={(date) => setVisitDate(date)}
        />
      </div>

      {formError && (
        <span className="form-error" role="alert">
          <strong>{formError}</strong>
        </span>
      )}
      <div className="mt-2">
        <button type="submit" className="btn btn-primary" onClick={submitForm}>
          Submit
        </button>
        {review && (
          <button className="ml-2 btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
