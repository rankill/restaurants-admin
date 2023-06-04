import React, { useState, useEffect } from "react";

export default function ReplyForm({
  review,
  onSubmit,
  onCancel,
  error,
  title = "Reply to the review",
}) {
  const [text, setText] = useState(review ? review.reply.text : "");
  const [formError, setFormError] = useState(null);
  useEffect(() => {
    setFormError(error);
  }, [error]);

  const submitForm = (e) => {
    if (text.length === 0) {
      setFormError("Please input reply text.");
    } else {
      onSubmit({ reply: text });
    }
  };

  return (
    <div className="pl-4 mt-3">
      <h6 className="">{title}</h6>
      <div className="mt-2">
        <textarea
          className="form-control"
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {formError && (
        <span className="form-error" role="alert">
          <strong>{formError}</strong>
        </span>
      )}
      <div className="mt-2">
        <button
          type="submit"
          className="btn btn-sm btn-primary"
          onClick={submitForm}
        >
          {review ? "Update" : "Reply"}
        </button>
        <button className="ml-2 btn btn-sm btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
