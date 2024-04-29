import React, { Component, useRef, useEffect } from "react";
import { Button, Form, Tooltip } from "antd";
import renderField from "app/components/inputs";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { withTranslation } from "react-i18next";
import searchFields from "./searchFields";
import { map, pick } from "lodash";
import memoize from "memoize-one";
import {
  serverFieldMapper,
  apply_field_permission,
} from "app/helpers/functions";
import style from "./style.less";
import { reset } from "redux-form";

class searchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      button: "",
    };

    this.fields = map(searchFields, (value, key) => ({
      name: key,
      ...serverFieldMapper(value),
    }));
  }

  // componentDidMount() {
  //
  //   let form=useRef();
  //   useEffect(()=>{
  //     form.current.submit();
  //   },[])
  // }

  handleReset() {
    this.props.form.resetFields();
  }

  filteringFields = memoize((values) => {
    console.log(
      "d",
      this.fields.filter((field) =>
        apply_field_permission(values, field, this.props)
      )
    );
    return this.fields.filter((field) =>
      apply_field_permission(values, field, this.props)
    );
  });

  componentWillReceiveProps(nextProps) {
    if (
      this.props.currentTab &&
      this.props.currentTab.name !== nextProps.currentTab.name
    ) {
      this.handleReset();
    }
  }
  render() {
    //
    const { t, handleSubmit, searchVals, onSubmit } = this.props;
    // let newSearchValues=
    return (
      <div>
        <div>
          <Form
            // ref={form}
            layout="inline"
            className={style.form_archive}
            onSubmit={handleSubmit((values) =>
              onSubmit(values, this.state.button)
            )}
          >
            {this.filteringFields(searchVals).map((field) => (
              <Field
                component={renderField}
                key={field.name}
                {...{ ...searchVals }}
                {...field}
                {...{
                  ...field,
                  ...pick(this.props, ["touch", "untouch", "change"]),
                }}
              />
            ))}
            <div className="reset-button">
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  this.props.reset("searchForm");
                }}
              >
                مسح
              </Button>
              <Button
                htmlType="submit"
                onClick={() => {
                  this.setState({ button: "search" });
                }}
                className="search_archive"
              >
                {t("search")}
              </Button>
            </div>

            {/* {this.state.button ? <Button className="btn btn-warning btnReport" htmlType='submit' onClick={() => {this.setState({button: 'report'})}}> 
                            {t('report')} </Button> :false} */}
          </Form>
        </div>
      </div>
    );
  }
}

export const SearchForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation("labels")(
    reduxForm({
      form: "searchForm",
    })(searchComponent)
  )
);
