import React, { Component } from "react";
import { Select, Input, message, Spin } from "antd";
import {
  addedParcelMapServiceUrl,
  editAndDeleteMapLayers,
  layersSetting,
} from "../mapviewer/config";
import {
  getFeatureDomainName,
  getLayerId,
  isLayerExist,
  queryTask,
  showLoading,
  zoomToFeatureByFilter,
  clearGraphicFromLayer,
} from "../common/common_func";

class FilterComponent extends Component {
  state = {
    searchLayer: null,
    searchLayers: [],
    formValues: {},
    searchFields: [],
    isActiveBufferSearch: false,
    showInfo: false,
    noData: false,
  };
  self = this;
  mapPoint = null;

  componentDidMount() {
    this.setState({
      searchLayers: Object.keys(editAndDeleteMapLayers)
        .map((key) => {
          return {
            layerName: key,
            layer: editAndDeleteMapLayers[key],
            name: editAndDeleteMapLayers[key].name,
          };
        })
        .filter((l) => {
          return (
            l.layer.searchFields &&
            isLayerExist(this.props.map.__mapInfo, l.layerName)
          );
        }),
    });
  }
  componentWillUnmount() {
    clearGraphicFromLayer(this.props.map, "ZoomGraphicLayer");
  }
  handleSearchSelect = () => (layer) => {
    this.setState({
      searchLayer: layer,
      showInfo: false,
      noData: false,
      formValues: {},
      searchFields: [],
      isActiveBufferSearch: false,
    });
    this.props.setSelectMapLayer(layer);
    this.getListsValue(layer);
  };

  getListsValue = (layer, getListsAfterFieldName, parentFilter) => {
    //get all filters
    let promiseQueries = [];
    let fieldsName = [];
    let layerdId = getLayerId(this.props.map.__mapInfo, layer);

    editAndDeleteMapLayers[layer]?.searchFields
      ?.filter((x) => !x.isSearch)
      .forEach((item, index) => {
        if (!getListsAfterFieldName) {
          fieldsName.push(item.field);

          let filterQuery = parentFilter
            ? parentFilter + " and " + item.field + " is not null"
            : "1=1";

          promiseQueries.push(
            queryTask({
              url: addedParcelMapServiceUrl + "/" + layerdId,
              where: filterQuery,
              outFields:
                item.zoomLayer &&
                item.zoomLayer.filterField &&
                !item.zoomLayer.isNotSameAttributeNameInLayer
                  ? [item.field, item.zoomLayer.filterField]
                  : [item.field],
              returnGeometry: false,
              returnExecuteObject: true,
              returnDistinctValues: true,
            })
          );
        } else {
          if (item.field == getListsAfterFieldName)
            getListsAfterFieldName = null;
        }
      });

    if (promiseQueries.length > 0) showLoading(true);
    else {
      this.setState({
        searchFields: editAndDeleteMapLayers[layer]?.searchFields?.filter(
          (x) => !x.isSearch
        ),
      });
    }

    if (!this.state.formValues["MUNICIPALITY_NAME"]) {
      promiseQueries = [promiseQueries[0]];
      fieldsName = [fieldsName[0]];
    }

    Promise.all(promiseQueries).then((resultsData) => {
      this.mapResultWithDomain(resultsData, fieldsName, layerdId).then(
        (data) => {
          data.forEach((item, index) => {
            let searchField = editAndDeleteMapLayers[layer]?.searchFields?.find(
              (x) => x.field == fieldsName[index]
            );
            if (item.features.length > 0) {
              searchField.dataList =
                fieldsName[index] === "MUNICIPALITY_NAME"
                  ? [
                      ...item.features
                        .filter(
                          (f) =>
                            typeof f.attributes["MUNICIPALITY_NAME"] ===
                            "string"
                        )
                        .sort((a, b) =>
                          a.attributes["MUNICIPALITY_NAME"].localeCompare(
                            b.attributes["MUNICIPALITY_NAME"],
                            "ar"
                          )
                        ),
                    ]
                  : [...item.features];
            } else {
              searchField.dataList = [];
            }
          });
          showLoading(false);
          this.setState({
            searchFields: this.state.formValues["MUNICIPALITY_NAME"]
              ? editAndDeleteMapLayers[layer]?.searchFields?.filter(
                  (x) => !x.isSearch
                )
              : editAndDeleteMapLayers[layer]?.searchFields?.filter(
                  (x) => x.field == "MUNICIPALITY_NAME"
                ),
            formValues: { ...this.state.formValues },
          });
        }
      );
    });
  };

  mapResultWithDomain = (results, fieldsName, layerId) => {
    return new Promise((resolve, reject) => {
      let count = fieldsName.length;

      results.forEach((item, index) => {
        getFeatureDomainName(
          item.features,
          layerId,
          false,
          addedParcelMapServiceUrl
        ).then((domainResult) => {
          if (domainResult) item.features = domainResult;

          --count;
          if (count < 1) {
            resolve(results);
          }
        });
      });
    });
  };

  selectChange = (name, listData, item) => (e) => {
    this.setState({ showInfo: false, noData: false });
    if (!e) {
      clearGraphicFromLayer(this.props.map, "ZoomGraphicLayer");
      this.setState({ [name]: undefined });
    }
    this.setState(
      { formValues: { ...this.state.formValues, [name]: e } },
      () => {
        let searchField = editAndDeleteMapLayers[
          this.state.searchLayer
        ].searchFields.find((i) => i.field == name && !i.isSearch);
        if (searchField) {
          let filterQuery = [];

          if (searchField.zoomLayer) {
            let item = searchField.dataList.find(
              (x) =>
                (x.attributes[name + "_Code"] || x.attributes[name]) ==
                this.state.formValues[name]
            );

            if (item) {
              let where = "";
              if (searchField.zoomLayer.isNotSameAttributeNameInLayer) {
                where =
                  searchField.zoomLayer.filterField +
                  "=" +
                  "'" +
                  (item.attributes[searchField.field + "_Code"] ||
                    item.attributes[searchField.zoomLayer.field]) +
                  "'";
              } else {
                where =
                  searchField.zoomLayer.filterField +
                  "=" +
                  "'" +
                  (item.attributes[
                    searchField.zoomLayer.filterField + "_Code"
                  ] || item.attributes[searchField.zoomLayer.filterField]) +
                  "'";
              }

              if (e) {
                zoomToFeatureByFilter(
                  where,
                  searchField.zoomLayer.name,
                  this.props.map,
                  null,
                  (data) => {
                    if (item) {
                      item.attributes["OBJECTID"] = data.attributes["OBJECTID"];
                      item.geometry = data.geometry;
                      this.state[name + "_Object"] = item;
                    }
                  }
                );
              }
            }
          }

          this.state.formValues = this.deleteChildValues(name);

          Object.keys(this.state.formValues).forEach((key) => {
            if (this.state.formValues[key])
              filterQuery.push(key + "='" + this.state.formValues[key] + "'");
          });

          this.getListsValue(
            this.state.searchLayer,
            name,
            filterQuery.join(" and ")
          );
        }
      }
    );
  };

  deleteChildValues = (name) => {
    let found = false;
    editAndDeleteMapLayers[this.state.searchLayer].searchFields.forEach(
      (item) => {
        if (found) {
          delete this.state.formValues[item.field];
          delete this.state[item.field];
        }
        if (item.field == name) {
          found = true;
        }
      }
    );

    return this.state.formValues;
  };

  handleChangeInput = (e) => {
    this.setState({
      showInfo: false,
      noData: false,
      formValues: { ...this.state.formValues, [e.target.name]: e.target.value },
    });
  };

  handleBufferSearch = (e) => {
    this.setState({
      showInfo: false,
      noData: false,
      buffer_distance: e.target.value,
    });
  };

  searchForData = (e) => {
    let searchFields =
      editAndDeleteMapLayers[this.state.searchLayer].searchFields;
    let selectedFeature =
      this.state[searchFields[searchFields.length - 1].field + "_Object"];

    let layerdId = getLayerId(this.props.map.__mapInfo, this.state.searchLayer);

    queryTask({
      url:
        this.props.map.getLayer("basemap").url.split("?")[0] + "/" + layerdId,
      where: "OBJECTID = " + selectedFeature.attributes["OBJECTID"],
      outFields: layersSetting[this.state.searchLayer].outFields,
      returnGeometry: false,
      callbackResult: ({ features }) => {
        if (features.length > 0) {
          getFeatureDomainName(
            features,
            layerdId,
            false,
            addedParcelMapServiceUrl
          ).then((res) => {
            selectedFeature.attributes = { ...res[0].attributes };
            selectedFeature.layerName = this.state.searchLayer;
            this.props.addFeature(selectedFeature);
            this.state.formValues[searchFields[searchFields.length - 1].field] =
              null;

            this.setState({ formValues: { ...this.state.formValues } });
          });
        }
      },
      callbackError(error) {},
    });
  };

  onChange = (e) => {
    this.setState({ isActiveBufferSearch: !this.state.isActiveBufferSearch });
  };
  changeDate = (name) => (e) => {
    this.setState({ formValues: { ...this.state.formValues, [name]: e } });
  };

  onSearch = (item, filterValue) => {
    if (item.isServerSideSearch) {
      if (this.searchTimeOut) clearTimeout(this.searchTimeOut);

      this.searchTimeOut = setTimeout(() => {
        this.setState({ fetching: true });

        let filterQuery = [];

        Object.keys(this.state.formValues).forEach((key) => {
          if (
            this.state.formValues[key] &&
            key != item.field &&
            key != item.isServerSideSearch
          )
            filterQuery.push(key + "='" + this.state.formValues[key] + "'");
        });

        if (filterValue) {
          filterQuery.push(item.field + " like '%" + filterValue + "%'");
        }

        let layerdId = getLayerId(
          this.props.map.__mapInfo,
          this.state.searchLayer
        );

        queryTask({
          url: addedParcelMapServiceUrl + "/" + layerdId,
          where: filterQuery.join(" and "),
          outFields: [item.field, item.zoomLayer.filterField],
          returnDistinctValues: true,
          returnGeometry: false,
          callbackResult: ({ features }) => {
            let searchField = editAndDeleteMapLayers[
              this.state.searchLayer
            ].searchFields.find((x) => x.field == item.field);

            if (features.length > 0) searchField.dataList = [...features];

            this.setState({
              searchFields: [
                ...editAndDeleteMapLayers[
                  this.state.searchLayer
                ].searchFields.filter((x) => !x.isSearch),
              ],
              formValues: { ...this.state.formValues },
              fetching: false,
            });
          },
        });
      }, 500);
    }
  };

  isActive = () => {
    let searchFields =
      editAndDeleteMapLayers[this.state.searchLayer].searchFields;
    return !this.state.formValues[searchFields[searchFields.length - 1].field];
  };

  render() {
    const { t } = this.props;
    const filterText =
      this.state.searchLayer &&
      editAndDeleteMapLayers[this.state.searchLayer].searchFields.find(
        (x) => x.isSearch
      );
    return (
      <div style={{ textAlign: "right", paddingRight: "10px" }}>
        <div style={{ display: "grid" }}>
          <label className="selectLabelStyle">الطبقة</label>
          {/**Layer */}
          <Select
            virtual={false}
            showSearch
            className="dont-show"
            onChange={this.handleSearchSelect()}
            value={this.state.searchLayer}
            placeholder="الطبقة"
            getPopupContainer={(trigger) => trigger.parentNode}
            optionFilterProp="v"
            filterOption={(input, option) =>
              option.v && option.v.indexOf(input) >= 0
            }>
            {this.state.searchLayers.map((s, index) => (
              <Select.Option v={s.name} value={s.layerName} id={s.layerName}>
                {s.name}
              </Select.Option>
            ))}
          </Select>

          {this.state.searchFields.map((item, index) => {
            return (
              <div style={{ display: "grid" }} key={index}>
                <label className="selectLabelStyle">{item.alias}</label>

                <Select
                  style={{ width: "50%" }}
                  virtual={false}
                  disabled={item.dataList && item.dataList.length == 0}
                  showSearch
                  allowClear
                  notFoundContent={
                    this.state.fetching ? <Spin size="small" /> : null
                  }
                  onChange={this.selectChange(item.field, item.dataList, item)}
                  value={this.state.formValues[item.field]}
                  placeholder={item.alias}
                  onSearch={(e) => {
                    this.setState({ [item.field]: e });
                    this.onSearch(item, e);
                  }}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  optionFilterProp="v">
                  {item.dataList &&
                    item.dataList
                      .filter((e, i) => {
                        if (this.state[item.field]) {
                          return (
                            e.attributes[item.field] &&
                            e.attributes[item.field]
                              .toLowerCase()
                              .indexOf(this.state[item.field].toLowerCase()) >=
                              0
                          );
                        } else {
                          return i < 100 && e.attributes[item.field];
                        }
                      })
                      .slice(0, 50)
                      .map((m, i) => {
                        return (
                          <Select.Option
                            key={m.attributes[item.field] + i}
                            v={m.attributes[item.field]}
                            value={
                              m.attributes[item.field + "_Code"] ||
                              m.attributes[item.field]
                            }>
                            {m.attributes[item.field]}
                          </Select.Option>
                        );
                      })}
                </Select>
              </div>
            );
          })}
        </div>

        {this.state.searchLayer && (
          <div>
            {filterText && (
              <div style={{ display: "grid" }}>
                <label className="selectLabelStyle">{filterText.alias}</label>

                <Input
                  name={filterText.field}
                  onChange={this.handleChangeInput}
                  value={this.state.formValues[filterText.field]}
                  placeholder={filterText.alias}
                />
              </div>
            )}

            <div style={{ display: "grid" }}>
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={this.searchForData}
                  className="SearchBtn mt-3 w-25"
                  size="large"
                  disabled={this.isActive()}
                  htmlType="submit">
                  إضافة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default FilterComponent;