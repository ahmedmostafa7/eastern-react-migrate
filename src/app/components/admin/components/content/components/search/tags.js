import React, { Component } from "react";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { Tag } from "antd";
import { map, pickBy } from "lodash";
import { withTranslation } from "react-i18next";

class Tags extends Component {
  handleClose(filterName) {
    this.props.removeFilter(filterName, this.props);
  }

  render() {
    const { filters, t } = this.props;
    return (
      <div className="tags">
        {map(
          pickBy(filters, (d) => d.label),
          (tag, name) => (
            <div key={name}>
              {t(tag.show)}:
              <Tag closable onClose={this.handleClose.bind(this, name)}>
                {t(tag.label)}
              </Tag>
            </div>
          )
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("admins")(Tags));
