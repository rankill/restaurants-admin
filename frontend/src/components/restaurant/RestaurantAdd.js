import React, { useState } from "react";
import RestaurantForm from "./RestaurantForm";
import { createRestaurant } from "../../services";

export default function RestaurantAdd({ history }) {
  const [submitError, setSubmitError] = useState(null);

  const submitForm = async (formData) => {
    try {
      await createRestaurant(formData);
      history.push("/restaurants");
    } catch (e) {
      setSubmitError(e.message);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header font-weight-bold">
              Create Restaurant
            </div>
            <div className="card-body">
              <RestaurantForm
                submitButtonText="Create Restaurant"
                formError={submitError}
                handleSubmit={submitForm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
