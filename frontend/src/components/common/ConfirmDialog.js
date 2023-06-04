import React from "react";
import Modal from "react-bootstrap/Modal";

export default function ConfirmDialog({ show, text, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} animation={true}>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onConfirm}>
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  );
}
