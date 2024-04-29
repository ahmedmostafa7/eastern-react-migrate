import React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { get, find } from "lodash";
import { fetchAllData } from "app/helpers/functions";
import { withTranslation } from "react-i18next";

export class selectComponent extends React.Component {
  componentDidMount() {
    const {
      data = [],
      setNextUrl,
      setData,
      fetch,
      links = {},
      ux_pattern,
      api_config,
      VALUE,
      inconsistant,
    } = this.props;
    const { nextLink } = links;
    if (
      (fetch || this.props.field.fetch) &&
      (!data.length ||
        (ux_pattern != "infiniteScrolling" && (nextLink || inconsistant)))
    ) {
      ux_pattern == "infiniteScrolling"
        ? this.getScrollingData(this.props, true)
        : fetchAllData(fetch || this.props.field.fetch, api_config).then(
            (data) => {
              setData(data);
              setNextUrl("");
            }
          );
    }
  }

  getScrollingData(props, onMount) {
    // const { fetch, addToData, setData, links = {}, api_config, setNextUrl, pageSize = 20 } = props;
    // const { nextLink } = links;
    // if (onMount) {
    //     return fetchData(fetch, {
    //         ...api_config,
    //         params: {
    //             ...get(api_config, 'params'),
    //             pageSize: pageSize
    //         }
    //     })
    //         .then(({ results, next }) => {
    //             setData(results);
    //             setNextUrl(next)
    //         })
    // }
    // else {
    //     return fetchData(nextLink, omit(api_config, 'params'))
    //         .then(({ results, next }) => {
    //             addToData(results, -1);
    //             setNextUrl(next);
    //         })
    // }
  }

  render() {
    //;
    const { field, data, val, t, values } = this.props;
    const show =
      get(
        values,
        field.show,
        get(
          find(field.data || data, { [field.value_key || "value"]: val }),
          field.label_key || "label"
        )
      ) ||
      get(
        find(field.data || data, { [field.value_key || "value"]: val }),
        field.label_key || "label"
      ) ||
      val;

    return <p>{t(show)}</p>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(selectComponent));
