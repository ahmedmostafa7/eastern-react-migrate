import React, { Component } from "react";
import { ownerFields } from "./ShowOwnerFields";
import { get, map } from "lodash";
import { withTranslation } from "react-i18next";
import ShowField from "app/helpers/components/show";
import { convertToArabic } from "../../../../../../../../inputs/fields/identify/Component/common/common_func";

class showData extends Component {
  constructor(props) {
    super(props);

    this.fields =
      props.fields ||
      get(ownerFields, props.owner_type || props.data.type || "1");
  }

  renderInfo = (field, key) => {
    const { data } = this.props;
    let result = get(data, key);
    if (field.init_data) {
      result = field.init_data({
        val: result,
        ...this.props,
        //   nationialities: this.props.nationialities,
        //   nationialTypes: this.props.nationialTypes,
      });
    }

    return (
      <ShowField
        field={field}
        values={data}
        val={
          (["email", "image"].indexOf(key) == -1 && convertToArabic(result)) ||
          result
        }
        key={key}
      />
    );
  };
  render() {
    return map(this.fields, this.renderInfo);
  }
}

export default withTranslation("labels")(showData);
