import React, { useState, useEffect } from "react";
import Review from "./Review";
import Pagination from "../common/Pagination";
import StarRatingDropdown from "../common/RatingDropdown";
import ReplyForm from "./ReplyForm";
import Reply from "./Reply";
import { fetchPendingReviews, replyToReview } from "../../services";

export default function PendingReviews({ history }) {
  const [reviews, setReviews] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [replyReviewId, setReplyReviewId] = useState(0);
  const [submitReplyError, setSubmitReplyError] = useState(null);

  async function fetchReviewsData() {
    try {
      const data = await fetchPendingReviews({
        page,
        perPage,
        search,
        rating: ratingFilter,
      });

      setReviews(data.reviews);
      setTotal(data.total);
      setPage(data.page);
      setLoaded(true);
    } catch (e) {
      setFetchError(e.message);
    }
  }

  useEffect(() => {
    fetchReviewsData();
  }, [page, perPage, search, ratingFilter]);

  const onExpandReply = (reviewId) => {
    setReplyReviewId(reviewId);
  };

  const onReply = async (reviewId, replyData) => {
    try {
      const data = await replyToReview(reviewId, replyData);
      const newReviews = reviews.map((review) =>
        review.id === reviewId ? data : review
      );
      setReviews(newReviews);
      fetchReviewsData();
      setReplyReviewId(0);
    } catch (e) {
      setSubmitReplyError(e.message);
    }
  };

  const onCancelReply = () => {
    setReplyReviewId(0);
  };

  const renderReviews = () => {
    console.log(reviews);
    return (
      <div className="review-list">
        {reviews &&
          reviews.map((review) => (
            <div className="review-item pb-4 pt-2" key={review.id}>
              <Review review={review} showRestaurant={true} />
              {review.reply && <Reply review={review} />}

              {replyReviewId !== review.id && !review.reply && (
                <a
                  className="small font-weight-bold"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onExpandReply(review.id);
                  }}
                >
                  Reply
                </a>
              )}

              {replyReviewId === review.id && (
                <ReplyForm
                  onSubmit={(data) => onReply(review.id, data)}
                  onCancel={onCancelReply}
                  error={submitReplyError}
                />
              )}
            </div>
          ))}
      </div>
    );
  };
  const pageCount = Math.floor(total / perPage) + 1;
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card mt-5">
            <div className="card-body">
              <h5 className="mt-2">
                Pending Reviews{" "}
                <span className="text-secondary">({total})</span>
              </h5>
              <div className="my-3">
                <span className="mr-3">Filter by</span>{" "}
                <StarRatingDropdown
                  value={ratingFilter}
                  onChange={(r) => {
                    setRatingFilter(r);
                    setPage(1);
                  }}
                />
              </div>

              {renderReviews()}
              {reviews.length === 0 && loaded && (
                <div>No pending reviews found.</div>
              )}
            </div>
            <div className="mr-5">
              <div className="float-right"></div>

              <Pagination
                perPage={perPage}
                page={page}
                total={total}
                onChange={(p) => setPage(p)}
              />
            </div>
          </div>

          {fetchError && <p className="text-danger mt-4">{fetchError}</p>}
        </div>
      </div>
    </div>
  );
}
