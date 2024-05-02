import React, { Component } from "react";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "apps/routing/withRouter";
import { Pagination, Form, Button } from "antd";
import renderField from "app/components/inputs";
import { Field, reduxForm } from "redux-form";
import { map, pick } from "lodash";
import searchFields from "./followingFields";
import axios from "axios";
import {
  serverFieldMapper,
  apply_field_permission,
} from "app/helpers/functions";
import { convertToArabic } from "app/components/inputs/fields/identify/Component/common/common_func";
class FollowingRequestsComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currentPage: 1,
      // next: "",
    };
    this.fields = map(searchFields, (value, key) => ({
      name: key,
      ...serverFieldMapper(value),
    }));
  }
  componentDidMount() {
    axios
      .get(window.host + `/submission/statistics/app/16/classificationStats`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        // console.log(res)

        this.setState({
          data: res.data.results,
          total: res.data.totalPages,
          count: res.data.count,
        });

        console.log(res.data.totalPages);
      });
  }
  handleFollowingReChange(page) {
    axios
      .get(
        window.host +
          "/submission/statistics/app/16/classificationStats" +
          "?" +
          `pageNum=${page} `
      )
      .then((res) => {
        this.setState({ data: res?.data?.results, currentPage: page });
        console.log(res);
      });

    // this.getValues(this.state.criteria || {}, "search", page);
  }
  filterSearch(values) {
    const { from_date, to_date, search } = values;

    let from = (from_date && from_date.split("/").reverse().join("-")) || "";
    let to = (to_date && to_date.split("/").reverse().join("-")) || "";
    axios
      .get(
        window.host +
          `/submission/statistics/app/16/classificationStats?request_no=${
            search || ""
          }&from=${from}&to=${to}`
      )
      .then((res) => {
        this.setState({ data: res?.data?.results, total: res.data.totalPages });
        console.log(res);
      });
  }
  reset() {
    this.props.reset("searchForm");
    axios
      .get(
        window.host +
          "/submission/statistics/app/16/classificationStats" +
          "?" +
          `pageNum=${1} `
      )
      .then((res) => {
        this.setState({ data: res?.data?.results, total: res.data.totalPages });
        console.log(res);
      });
  }

  filterClassification(data, name) {
    return convertToArabic(
      data.durations.filter((d) => d.classification == name)[0]?.duration
    );
  }

  render() {
    const { data, total, currentPage, count } = this.state;
    const { handleSubmit } = this.props;
    console.log(data, currentPage);

    return (
      <div>
        <Form
          onSubmit={handleSubmit(this.filterSearch.bind(this))}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr ",
            alignItems: "center",
            gridGap: "15px",
          }}
        >
          {this.fields.map((field, index) => {
            return (
              <Field
                component={renderField}
                key={field.name}
                // {...{ ...searchVals }}
                {...field}
                {...{
                  ...field,
                  ...pick(this.props, ["touch", "untouch", "change"]),
                }}
              />
            );
          })}
          <div style={{ justifySelf: "center", gridColumn: "1/3" }}>
            <Button htmlType="submit" className="search_archive">
              بحث
            </Button>{" "}
            <Button style={{ marginLeft: 8 }} onClick={this.reset.bind(this)}>
              مسح
            </Button>
          </div>
        </Form>
        {data.length > 0 && (
          <Pagination
            pageSize={18}
            current={currentPage}
            hideOnSinglePage={true}
            total={count}
            onChange={this.handleFollowingReChange.bind(this)}
            style={{
              bottom: "0px",
              margin: "0px 0px 40px 0px",
              position: "relative",
            }}
          />
        )}
        <table className="table table-bordered">
          <thead>
            <th>رقم المعاملة</th>
            <th>تاريخ انشاء المعاملة</th>
            <th>اسم المالك</th>
            <th>مراجعة الفكرة التخطيطية</th>
            <th>اعتماد اللجنة الفنية</th>
            <th>مطابقة على الطبيعة</th>
            <th>الاعتماد المبدئي</th>
            <th>تطوير البنية التحتية</th>
            <th>طلب اعتماد نهائي تبتيري</th>
            <th>مراجعة المخطط التبتيري</th>
            <th>الاعتماد النهائي</th>
          </thead>
          <tbody>
            {data.map((d) => {
              return (
                <tr>
                  <td>{convertToArabic(d.request_no)}</td>
                  <td>{convertToArabic(d.create_date)}</td>
                  <td>{d.owner_name}</td>
                  <td>
                    {this.filterClassification(
                      d,
                      "مراجعة و إعتماد الفكرة التخطيطية"
                    )}
                  </td>
                  <td>
                    {this.filterClassification(d, "اعتماد اللجنة الفنية")}
                  </td>
                  <td>{this.filterClassification(d, "مطابقة علي الطبيعة")}</td>
                  <td>{this.filterClassification(d, "الاعتماد المبدئي")}</td>
                  <td>
                    {this.filterClassification(
                      d,
                      "تطوير البنية التحتية للمخطط"
                    )}
                  </td>
                  <td>
                    {this.filterClassification(
                      d,
                      "طلب إعتماد نهائي مخطط تبتيري"
                    )}
                  </td>
                  <td>
                    {this.filterClassification(d, "مراجعة المخطط التبتيري")}
                  </td>
                  <td>{this.filterClassification(d, "الاعتماد النهائي")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
export const FollowingRequests = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withTranslation("tabs")(
      reduxForm({
        form: "searchForm",
      })(FollowingRequestsComp)
    )
  )
);
