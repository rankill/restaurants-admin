import React, { useState, useEffect } from "react";
import ReplyForm from "./ReplyForm";
import moment from "moment-timezone";
import { updateReply } from "../../services";

export default function Reply({
  editable = false,
  review,
  onUpdated,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [updateReplyError, setUpdateReplyError] = useState(null);

  const onCancelEditing = () => {
    setEditing(false);
  };

  const onUpdateReply = async (data) => {
    try {
      const updated = await updateReply(review.id, data);
      onUpdated(updated);
      setEditing(false);
    } catch (e) {
      setUpdateReplyError(e.message);
    }
  };

  return editing ? (
    <ReplyForm
      review={review}
      title="Update reply"
      onSubmit={onUpdateReply}
      onCancel={onCancelEditing}
      error={updateReplyError}
    />
  ) : (
    <div className="pl-4 pt-3 small font-italic">
      {editable && (
        <div className="float-right">
          <a
            className="btn text-secondary px-1"
            onClick={(e) => setEditing(!editing)}
          >
            <i className="fas fa-edit small"></i>
          </a>
          <a
            className="btn text-secondary px-1"
            onClick={(e) => {
              onDelete(review.id);
              setEditing(false);
            }}
          >
            <i className="far fa-trash-alt small"></i>
          </a>
        </div>
      )}
      <div className="font-weight-bold">Reply</div>
      <div>
        {(review.reply.text || "").split("\n").map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
      <div className="text-secondary">
        Replied {moment(review.reply.createdAt).fromNow()}
      </div>
    </div>
  );
}
