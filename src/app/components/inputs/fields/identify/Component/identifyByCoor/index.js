import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Button, Form, Tooltip } from "antd";
import RenderField from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";
import coorFields from "./fields";

class CoorIdentify extends Component {
  constructor(props) {
    super(props);
    this.fields = coorFields.map((f) => serverFieldMapper(f));
    this.state = {
      submitting: false,
      error: "",
    };
  }

  handleSubmit = (e) => {
    console.log(e);
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <Form layout="inline" className="top1">
          {this.fields.map((field) => {
            return (
              <Field
                key={field.name}
                name={field.name}
                component={RenderField}
                {...field}
              />
            );
          })}

          <button type="submit" onClick={handleSubmit(this.handleSubmit)}>
            {" "}
            CLick
          </button>
        </Form>
        <button> CLick</button>
        <button> CLick</button>
        <button> CLick</button>
        <button> CLick</button>
        <button> CLick</button>
        <button> CLick</button>
      </div>
    );
  }
}
export default reduxForm({ form: "Add" })(CoorIdentify);
