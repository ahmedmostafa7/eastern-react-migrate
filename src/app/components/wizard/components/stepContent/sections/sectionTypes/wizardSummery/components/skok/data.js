import React, { Component } from "react";
import { SakFields } from "app/helpers/modules/fields";
import { get, map } from "lodash";
import { withTranslation } from "react-i18next";
import ShowField from "app/helpers/components/show";
import { mapStateToProps, mapDispatchToProps } from "../../mapping";
import { connect } from "react-redux";
import { convertToArabic } from "../../../../../../../../inputs/fields/identify/Component/common/common_func";
import axios from "axios";

class showData extends Component {
  constructor(props) {
    super(props);
    this.fields = {
      ...SakFields(),
      sakValid: {
        label: "sakValid",
      },
    };
  }
  renderInfo = (field, key) => {
    const { data } = this.props;
    return (
      <ShowField
        field={field}
        val={
          (["email", "image"].indexOf(key) == -1 &&
            convertToArabic(get(data, key))) ||
          get(data, key)
        }
        key={key}
      />
    );
  };

  render() {
    return map(this.fields, this.renderInfo);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(showData));
