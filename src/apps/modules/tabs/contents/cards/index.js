import React, { Component } from "react";
import Charts from "app/components/charts";
import { Card, Button } from "antd";
import { withTranslation } from "react-i18next";
import { Inputs } from "../inputs";
import { get } from "lodash";
import { mapStateToProps } from "./mapping";
import { connect } from "react-redux";
import { withRouter } from "apps/routing/withRouter";
import { apps } from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";

class cardsComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      content: { sections },
      t,
    } = this.props;
    // (!currentChart || currentChart && charts && charts[currentChart]?.results?.length > 0) &&
    const thesections = sections.map((section) => {
      const { title, extra, contentType, name } = section;
      const { currentChart, charts, appId } = this.props;

      return (
        <div key={name} className={"dd"}>
          <Card
            title={t(title)?.replaceAll(
              "(*)",
              apps.find((r) => r.appId == appId)?.name || ""
            )}
            extra={extra ? <Button type="primary">{t(extra)}</Button> : null}
            style={{ width: "100%" }}
          >
            {contentType == "Charts" ? (
              <Charts key={section.name} {...section} />
            ) : (
              <Inputs key={section.name} {...section} />
            )}
          </Card>
        </div>
      );
    });

    return <div>{thesections}</div>;
  }
}

export const cards = withRouter(
  connect(mapStateToProps)(withTranslation("tabs")(cardsComponent))
);
