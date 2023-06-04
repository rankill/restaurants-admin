import React, { useState, useEffect } from "react";
import FiveStarRatings from "../common/FiveStarRatings";
import { useParams } from "react-router-dom";
import ReviewForm from "../review/ReviewForm";
import Review from "../review/Review";
import Pagination from "../common/Pagination";
import StarRatingDropdown from "../common/RatingDropdown";
import ReplyForm from "../review/ReplyForm";
import Reply from "../review/Reply";
import ConfirmDialog from "../common/ConfirmDialog";
import {
  fetchReviewsForRestaurant,
  fetchRestaurant,
  createReview,
  replyToReview,
  deleteReview,
  deleteReply,
} from "../../services";
import { Role } from "../../config/constants";
import { useAuthState } from "../../contexts/AuthContext";

export default function Restaurant({ history }) {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(false);
  const [submitReviewError, setSubmitReviewError] = useState(null);
  const [replyReviewId, setReplyReviewId] = useState(0);
  const [submitReplyError, setSubmitReplyError] = useState(null);
  const [confirmDialogInfo, setConfirmDialogInfo] = useState({
    open: false,
    action: null,
    id: null,
  });
  const { authRole } = useAuthState();
  const editable = authRole === Role.Admin;
  async function fetchRestaurantData() {
    if (!restaurantId) {
      history.goBack();
    }
    try {
      const data = await fetchRestaurant(restaurantId);
      setRestaurant(data);
    } catch (e) {
      history.goBack();
    }
  }

  async function fetchReviewsData() {
    try {
      const data = await fetchReviewsForRestaurant(restaurantId, {
        page,
        perPage,
        search,
        rating: ratingFilter,
        noreply: pending,
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
    fetchRestaurantData();
  }, []);

  useEffect(() => {
    fetchReviewsData();
  }, [page, perPage, search, ratingFilter, restaurantId, pending]);

  const onSubmitReview = async (data) => {
    try {
      await createReview(restaurantId, data);
      fetchReviewsData();
      fetchRestaurantData();
    } catch (e) {
      setSubmitReviewError(e.message);
    }
  };

  const onExpandReply = (reviewId) => {
    setReplyReviewId(reviewId);
  };

  const onUpdateReview = (updated) => {
    fetchReviewsData();
    fetchRestaurantData();
  };
  const onReply = async (reviewId, replyData) => {
    try {
      const data = await replyToReview(reviewId, replyData);
      const newReviews = reviews.map((review) =>
        review.id === reviewId ? data : review
      );
      setReviews(newReviews);
      setReplyReviewId(0);
    } catch (e) {
      setSubmitReplyError(e.message);
    }
  };

  const onCancelReply = () => {
    setReplyReviewId(0);
  };

  const onClickDeleteReview = (reviewId) => {
    setConfirmDialogInfo({
      open: true,
      text: "Are you sure to delete this review?",
      action: "delete_review",
      id: reviewId,
    });
  };

  const onClickDeleteReply = (reviewId) => {
    setConfirmDialogInfo({
      open: true,
      text: "Are you sure to delete the reply to this review?",
      action: "delete_reply",
      id: reviewId,
    });
  };

  const onHideConfirmDialog = () => {
    setConfirmDialogInfo({
      open: false,
    });
  };

  const onDialogConfirm = async () => {
    try {
      if (confirmDialogInfo.action === "delete_review") {
        await deleteReview(confirmDialogInfo.id);
      } else if (confirmDialogInfo.action === "delete_reply") {
        await deleteReply(confirmDialogInfo.id);
      }
      fetchReviewsData();
      fetchRestaurantData();
    } catch (e) {
      fetchReviewsData();
    }

    setConfirmDialogInfo({
      open: false,
    });
  };

  const renderReviews = () => {

    return (
      <div className="review-list">
        {reviews &&
          reviews.map((review) => (
            <div className="review-item pb-4 pt-2" key={review.id}>
              <Review
                review={review}
                editable={editable}
                onUpdated={onUpdateReview}
                onDelete={onClickDeleteReview}
              />
              {review.reply && (
                <Reply
                  review={review}
                  editable={editable}
                  onUpdated={onUpdateReview}
                  onDelete={onClickDeleteReply}
                />
              )}
              {authRole === Role.Owner && (
                <>
                  {replyReviewId !== review.id && !review.reply && (
                    <a
                      className="small font-weight-bold text-dark"
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
                </>
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
          {restaurant && (
            <div className="card">
              <div className="card-body">
                <h2 className="mb-0">{restaurant.name}</h2>
                <div className="mb-4">
                  {restaurant.rating && (
                    <div>
                      <FiveStarRatings rating={restaurant.rating || 0} />{" "}
                      <span
                        className="text-secondary ml-2 font-weight-bold"
                        style={{ position: "relative", top: "5px" }}
                      >
                        {restaurant.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <p className="pt-2 mb-3">{restaurant.description}</p>
                <p className="mb-1">
                  <span>Location: </span>
                  <span className="text-secondary">{restaurant.location}</span>
                </p>
                {restaurant.highestReview && <hr className="mt-5" />}

                {restaurant.highestReview && (
                  <div>
                    <h6 className="mt-3 mb-1">Highest rated review</h6>
                    <Review review={restaurant.highestReview} />
                  </div>
                )}
                {restaurant.lowestReview && (
                  <div>
                    <h6 className="mt-5 mb-1">Lowest rated review</h6>
                    <Review review={restaurant.lowestReview} />
                  </div>
                )}
              </div>
            </div>
          )}
          {restaurant && authRole === Role.Regular && !restaurant.reviewed && (
            <div className="card mt-5">
              <div className="card-body">
                <h5>Leave your review</h5>
                <ReviewForm
                  onSubmit={onSubmitReview}
                  error={submitReviewError}
                />
              </div>
            </div>
          )}
          {loaded && (
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="mt-2">
                  Reviews <span className="text-secondary">({total})</span>
                </h5>
                <div className="my-3">
                  <span className="mr-3">Filter by</span>{" "}
                  <StarRatingDropdown
                    value={ratingFilter}
                    onChange={setRatingFilter}
                  />
                  {authRole === Role.Owner && (
                    <>
                      <span className="ml-4 mr-2">Pending Reviews</span>{" "}
                      <input
                        type="checkbox"
                        value={pending}
                        onChange={() => setPending(!pending)}
                      />
                    </>
                  )}
                </div>

                {renderReviews()}
              </div>
              <div className="mr-5">
                <div className="float-right"></div>
                <Pagination
                  perPage={perPage}
                  page={page}
                  onChange={(p) => setPage(p)}
                  total={total}
                />
              </div>
            </div>
          )}

          {fetchError && <p className="text-danger mt-4">{fetchError}</p>}
        </div>
        <ConfirmDialog
          show={confirmDialogInfo.open}
          text={confirmDialogInfo.text}
          onConfirm={onDialogConfirm}
          onHide={onHideConfirmDialog}
        />
      </div>
    </div>
  );
}
