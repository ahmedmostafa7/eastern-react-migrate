import React from "react";
import { sortBy, slice, map, get, find, isNumber } from "lodash";
import { Button } from "antd";
import { backGroundColors, hoverColors } from "../colors";
import { fetchData } from "app/helpers/apiMethods";
import { convertToArabic } from "../inputs/fields/identify/Component/common/common_func";

export function getEvaluationData(props = null) {
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    //setCurrentChart,
    t,
  } = props || this.props;
  //setCurrentChart(name);
  //if (!results) {
  setLoading(true);
  fetchData(sectionUrl).then((data) => {
    const { count, results } = data;
    let newResults = sortBy(results, (o) => -o.count);
    const recievedData = {
      data: {
        labels: newResults.map((val) =>
          t((val.key && val.key.name) || val.name)
        ),
        datasets: [
          {
            data: newResults.map((val) => val.count),
            backgroundColor: slice(backGroundColors, 0, count),
            hoverBackgroundColor: slice(hoverColors, 0, count),
          },
        ],
      },
      results: newResults.map((value, index) => {
        return {
          color_key: (
            <Button
              size="small"
              shape="circle"
              style={{ backgroundColor: backGroundColors[index] }}
            ></Button>
          ),
          key: (value.key && value.key.id) || value.id,
          id: (value.key && value.key.id) || value.id,
          ...value,
        };
      }),
    };
    setChartData(recievedData, name);
    setLoading(false);
  });
  //}
}

export function getAllStatistics(useurl, usename, config = {}, useprops = {}) {
  const props = this ? this.props : useprops;
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    setChartsDates,
    //setCurrentChart,
    appId,
    t,
  } = props;

  let url = sectionUrl ? sectionUrl : useurl;
  let sectionName = usename ? usename : name;

  if (!results || config) {
    setLoading(true);
    fetchData(url, { params: { ...config } }).then((data) => {
      let running = 0,
        rejected = 0,
        finished = 0,
        stopped = 0;
      let firstApproval = 0,
        finalApproval = 0,
        underGoing = 0;
      data.map((val) => {
        running += val.running;
        rejected += val.rejected;
        finished += val.finished;
        stopped += val.stopped;
        firstApproval += val.firstApproval;
        finalApproval += val.finalApproval;
        underGoing += val.underGoing;
      });

      const dataObj = (appId == 26 && [
        { runningProcesses: (running == 0 && "٠") || running },
        { canceledProcesses: (rejected == 0 && "٠") || rejected },
        { finishedProcesses: (finished == 0 && "٠") || finished },
      ]) || [
        { runningProcesses: (running == 0 && "٠") || running },
        { rejectedProcesses: (rejected == 0 && "٠") || rejected },
        { finishedProcesses: (finished == 0 && "٠") || finished },
      ];

      const secDataObj = [
        { underGoingProcesses: (underGoing == 0 && "٠") || underGoing },
        {
          firstApprovalProcesses: (firstApproval == 0 && "٠") || firstApproval,
        },
        {
          finalApprovalProcesses: (finalApproval == 0 && "٠") || finalApproval,
        },
        //{ totalProcesses: underGoing + firstApproval + finalApproval },
      ];

      const recievedData = {
        data: {
          labels: map(dataObj, (v, k) => t(Object.keys(v)[0])),
          datasets: [
            {
              data: map(dataObj, (v, k) => t(Object.values(v)[0])),
              backgroundColor: slice(backGroundColors, 0, dataObj.length),
              hoverBackgroundColor: slice(hoverColors, 0, dataObj.length),
            },
          ],
        },
        results: map(
          [
            ...dataObj,
            {
              totalProcesses:
                (running + rejected + finished == 0 && "٠") ||
                running + rejected + finished,
            },
          ],
          (value, key) => {
            return {
              color_key: (Object.keys(value)[0] != "totalProcesses" && (
                <Button
                  size="small"
                  shape="circle"
                  style={{ backgroundColor: backGroundColors[key] }}
                ></Button>
              )) || <></>,
              key: key,
              id: key,
              processes_kind: t(Object.keys(value)[0]),
              number: Object.values(value)[0],
            };
          }
        ),
      };

      const secRecievedData = {
        data: {
          labels: map(secDataObj, (v, k) => t(Object.keys(v)[0])),
          datasets: [
            {
              data: map(secDataObj, (v, k) => t(Object.values(v)[0])),
              backgroundColor: slice(backGroundColors, 0, secDataObj.length),
              hoverBackgroundColor: slice(hoverColors, 0, secDataObj.length),
            },
          ],
        },
        results: map(secDataObj, (value, key) => {
          return {
            color_key: (
              <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: backGroundColors[key] }}
              ></Button>
            ),
            key: key,
            id: key,
            processes_kind: t(Object.keys(value)[0]),
            number: Object.values(value)[0],
          };
        }),
      };

      setChartData(recievedData, sectionName);
      setChartData(secRecievedData, `${sectionName}1`);
      if (!_.isEmpty(config) && setChartsDates) {
        setChartsDates(config.from, config.to);
      }
      setLoading(false);
    });
  }
}

export function SubmnsCountPerSteps(
  useurl,
  usename,
  config = {},
  useprops = {}
) {
  const props = this ? this.props : useprops;
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    setChartsDates,
    //setCurrentChart,
    t,
    appId,
  } = props;

  let url = sectionUrl ? sectionUrl : useurl;
  let sectionName = usename ? usename : name;

  if (!results || config) {
    setLoading(true);
    fetchData(url, { params: { ...config } }).then((data) => {
      data = data.filter((r) => !r.id || (r.id && r.id != 3022));
      const dataObj = [
        ...data
          .reduce((a, b) => {
            // if (b.categoryName) {
            //   let itemIndex = a.findIndex(
            //     (r) => Object.keys(r)[0] == b.categoryName
            //   );
            //   if (itemIndex == -1) {
            //     a.push({ [b.categoryName]: b.count });
            //   } else {
            //     a[itemIndex][b.categoryName] =
            //       a[itemIndex][b.categoryName] + b.count;
            //   }
            // }
            a.push({ [b.name]: b.count });
            return a;
          }, [])
          .map((r) => ({
            [Object.keys(r)[0]]:
              (Object.values(r)[0] == 0 && "٠") || Object.values(r)[0],
          })),
      ];

      //
      // const subDataObj = [...data].map(
      //   (r) => (r.count == 0 && { ...r, count: "٠" }) || { ...r }
      // );

      const recievedData = {
        data: {
          labels: map(dataObj, (v, k) => t(Object.keys(v)[0])),
          datasets: [
            {
              data: map(dataObj, (v, k) => Object.values(v)[0]),
              backgroundColor: slice(backGroundColors, 0, dataObj.length),
              hoverBackgroundColor: slice(hoverColors, 0, dataObj.length),
            },
          ],
        },
        results: map([...dataObj], (value, key) => {
          //
          // let fields = {
          //   steps: {
          //     hideLabel: true,
          //     field: "list",
          //     // init_data: (values, props) => {
          //     //
          //     //   if (!props.input.value) {
          //     //     props.input.onChange(subData);
          //     //   }
          //     // },
          //     fields: {
          //       name: {
          //         head: "Step name",
          //       },
          //       count: {
          //         head: "Number of processes",
          //       },
          //     },
          //   },
          // };

          return {
            color_key: (
              <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: backGroundColors[key] }}
                // onClick={() => {
                //
                //   let subData = subDataObj.filter(
                //     (r) => r.categoryName == Object.keys(value)[0]
                //   );
                //
                //   props.setMain("Popup", {
                //     popup: {
                //       type: "create",
                //       childProps: {
                //         fields,
                //         initialValues: { steps: [...subData] },
                //         ok(values) {
                //           return Promise.resolve(true);
                //         },
                //       },
                //     },
                //   });
                // }}
              ></Button>
            ),
            key: key,
            id: key,
            stepName: t(Object.keys(value)[0]),
            number: Object.values(value)[0],
          };
        }),
      };

      setChartData(recievedData, sectionName);
      if (!_.isEmpty(config) && setChartsDates) {
        setChartsDates(config.from, config.to);
      }
      setLoading(false);
    });
  }
}

export function SubmnsCountPerStep(
  useurl,
  usename,
  config = {},
  useprops = {}
) {
  const props = this ? this.props : useprops;
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    setChartsDates,
    //setCurrentChart,
    t,
    appId,
  } = props;

  let url = sectionUrl ? sectionUrl : useurl;
  let sectionName = usename ? usename : name;

  if (!results || config) {
    setLoading(true);
    fetchData(url, { params: { ...config } }).then((data) => {
      data = data.filter((r) => !r.id || (r.id && r.id != 3022));
      const dataObj = [
        ...data
          .reduce((a, b) => {
            if (b.categoryName) {
              let itemIndex = a.findIndex(
                (r) => Object.keys(r)[0] == b.categoryName
              );
              if (itemIndex == -1) {
                a.push({ [b.categoryName]: b.count });
              } else {
                a[itemIndex][b.categoryName] =
                  a[itemIndex][b.categoryName] + b.count;
              }
            }
            return a;
          }, [])
          .map((r) => ({
            [Object.keys(r)[0]]:
              (Object.values(r)[0] == 0 && "٠") || Object.values(r)[0],
          })),
      ];

      const subDataObj = [...data].map(
        (r) => (r.count == 0 && { ...r, count: "٠" }) || { ...r }
      );

      const recievedData = {
        data: {
          labels: map(dataObj, (v, k) => t(Object.keys(v)[0])),
          datasets: [
            {
              data: map(dataObj, (v, k) => Object.values(v)[0]),
              backgroundColor: slice(backGroundColors, 0, dataObj.length),
              hoverBackgroundColor: slice(hoverColors, 0, dataObj.length),
            },
          ],
        },
        results: map([...dataObj], (value, key) => {
          let fields = {
            steps: {
              hideLabel: true,
              field: "list",
              // init_data: (values, props) => {
              //
              //   if (!props.input.value) {
              //     props.input.onChange(subData);
              //   }
              // },
              fields: {
                name: {
                  head: "Step name",
                },
                count: {
                  head: "Number of processes",
                },
              },
            },
          };

          return {
            color_key: (
              <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: backGroundColors[key] }}
                onClick={() => {
                  let subData = subDataObj.filter(
                    (r) => r.categoryName == Object.keys(value)[0]
                  );

                  props.setMain("Popup", {
                    popup: {
                      type: "create",
                      childProps: {
                        fields,
                        initialValues: { steps: [...subData] },
                        ok(values) {
                          return Promise.resolve(true);
                        },
                      },
                    },
                  });
                }}
              ></Button>
            ),
            key: key,
            id: key,
            stepName: t(Object.keys(value)[0]),
            number: Object.values(value)[0],
          };
        }),
      };

      setChartData(recievedData, sectionName);
      if (!_.isEmpty(config) && setChartsDates) {
        setChartsDates(config.from, config.to);
      }
      setLoading(false);
    });
  }
}

export function SubmnsCountPerStepDelayed(
  useurl,
  usename,
  config = {},
  useprops = {}
) {
  const props = this ? this.props : useprops;
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    setChartsDates,
    //setCurrentChart,
    t,
    appId,
    isInvest,
  } = props;

  let url = sectionUrl ? sectionUrl : useurl;
  let sectionName = usename ? usename : name;

  if (!results || config) {
    setLoading(true);
    fetchData(url, { params: { ...config, delayedOnly: true } }).then(
      (data) => {
        data = data.filter((r) => !r.id || (r.id && r.id != 3022));
        if (isInvest) {
          data = [
            ...data.reduce((a, b) => {
              if (b.categoryname) {
                let index = a.findIndex(
                  (r) => r.categoryname == b.categoryname
                );
                if (index != -1) {
                  a[index].inTimeCount += b.inTimeCount;
                  a[index].warningCount += b.warningCount;
                  a[index].delayedCount += b.delayedCount;
                } else {
                  a.push(b);
                }
              }
              return a;
            }, []),
          ];
        }
        const recievedData = {
          data: {
            labels: map(data, (v, k) =>
              t(isInvest ? v.categoryname || v.name : v.name)
            ),
            datasets: [
              {
                label: "المعاملات في وقتها",
                data: map(data, (v, k) => v.inTimeCount),
                backgroundColor: "#228B22",
              },
              {
                label: "المعاملات قاربت على التأخير",
                data: map(data, (v, k) => v.warningCount),
                backgroundColor: "#FFFF00",
              },
              {
                label: "المعاملات المتأخرة",
                data: map(data, (v, k) => v.delayedCount),
                backgroundColor: "#FF0000",
              },
            ],
          },
          results: map([...data], (value, key) => {
            // let fields = {
            //   steps: {
            //     hideLabel: true,
            //     field: "list",
            //     // init_data: (values, props) => {
            //     //
            //     //   if (!props.input.value) {
            //     //     props.input.onChange(subData);
            //     //   }
            //     // },
            //     fields: {
            //       name: {
            //         head: "Step name",
            //       },
            //       count: {
            //         head: "Number of processes",
            //       },
            //     },
            //   },
            // };

            return {
              // color_key: (
              //   <Button
              //     size="small"
              //     shape="circle"
              //     style={{ backgroundColor: backGroundColors[key] }}
              //     onClick={() => {

              //       let subData = subDataObj.filter(
              //         (r) => r.categoryName == Object.keys(value)[0]
              //       );

              //       props.setMain("Popup", {
              //         popup: {
              //           type: "create",
              //           childProps: {
              //             fields,
              //             initialValues: { steps: [...subData] },
              //             ok(values) {
              //               return Promise.resolve(true);
              //             },
              //           },
              //         },
              //       });
              //     }}
              //   ></Button>
              // ),
              key: key,
              id: key,
              name: t(isInvest ? value.categoryname || value.name : value.name),
              inTimeCount: (value.inTimeCount == 0 && "٠") || value.inTimeCount,
              warningCount:
                (value.warningCount == 0 && "٠") || value.warningCount,
              delayedCount:
                (value.delayedCount == 0 && "٠") || value.delayedCount,
            };
          }),
        };

        setChartData(recievedData, sectionName);
        if (!_.isEmpty(config) && setChartsDates) {
          setChartsDates(config.from, config.to);
        }
        setLoading(false);
      }
    );
  }
}

export function checkTeamPerformance(
  useurl,
  usename,
  config = {},
  useprops = {}
) {
  const props = this ? this.props : useprops;
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    setChartsDates,
    //setCurrentChart,
    t,
    appId,
    isInvest,
  } = props;

  let url = sectionUrl ? sectionUrl : useurl;
  let sectionName = usename ? usename : name;

  if (!results || config) {
    setLoading(true);
    fetchData(url, { params: { ...config } }).then((data) => {
      data = (Array.isArray(data) && data) || data.stats;
      fetchData(
        `/submission/statistics/step/${3153}/finishedSubmnsCountPassedByStepPerUser`,
        { params: { ...config } }
      ).then((finishedData) => {
        finishedData =
          (Array.isArray(finishedData) && finishedData) || finishedData.stats;
        fetchData(
          `/submission/statistics/step/${3151}/finishedSubmnsCountPassedByStepPerUser`,
          { params: { ...config } }
        ).then((extendedData) => {
          extendedData =
            (Array.isArray(extendedData) && extendedData) || extendedData.stats;
          fetchData(
            `/submission/statistics/step/${3151}/currentDelayedCountPerUser`,
            { params: { ...config } }
          ).then((extendedDelayedData) => {
            extendedDelayedData =
              (Array.isArray(extendedDelayedData) && extendedDelayedData) ||
              extendedDelayedData.stats;
            data = finishedData.reduce((arr, e) => {
              arr.push(
                Object.assign(
                  {},
                  e,
                  data.find((a) => a.name == e.name)
                )
              );
              return arr;
            }, []);
            data = data.reduce((arr, e) => {
              let index = extendedData.findIndex((a) => a.name == e.name);
              if (index != -1) {
                e.finishedCount =
                  (e.finishedCount || 0) + extendedData[index].finishedCount;
              }
              arr.push(e);
              return arr;
            }, []);
            data = data.concat(
              extendedData.filter((r) => !data.find((e) => e.name == r.name))
            );
            data = data.reduce((arr, e) => {
              let index = extendedDelayedData.findIndex(
                (a) => a.name == e.name
              );
              if (index != -1) {
                e.delayedCount =
                  (e.delayedCount || 0) +
                  extendedDelayedData[index].delayedCount;
                e.currentCount =
                  (e.currentCount || 0) +
                  extendedDelayedData[index].currentCount;
              }
              arr.push(e);
              return arr;
            }, []);

            data = data.concat(
              extendedDelayedData.filter(
                (r) => !data.find((e) => e.name == r.name)
              )
            );
            const recievedData = {
              data: {
                labels: map(data, (v, k) => t(v.name)),
                datasets: [
                  {
                    label: "المعاملات الجارية",
                    data: map(data, (v, k) => v.currentCount),
                    backgroundColor: "#11823b",
                  },
                  {
                    label: "المعاملات المتأخرة",
                    data: map(data, (v, k) => v.delayedCount),
                    backgroundColor: "#FF0000",
                  },
                  {
                    label: "المعاملات المنجزة (المنتهية)",
                    data: map(data, (v, k) => v.finishedCount),
                    backgroundColor: "#FFFF00",
                  },
                ],
              },
              results: map([...data], (value, key) => {
                return {
                  key: key,
                  id: key,
                  name: t(value.name),
                  currentCount:
                    (!value.currentCount && "٠") || value.currentCount,
                  delayedCount:
                    (!value.delayedCount && "٠") || value.delayedCount,
                  finishedCount:
                    (!value.finishedCount && "٠") || value.finishedCount,
                };
              }),
            };

            setChartData(recievedData, sectionName);
            if (!_.isEmpty(config) && setChartsDates) {
              setChartsDates(config.from, config.to);
            }
            setLoading(false);
          });
        });
      });
    });
  }
}

const commonFunctions = {
  encodeQueryData: (data) => {
    let ret = [];
    for (let d in data) {
      if (data[d]) {
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
      }
    }
    return ret.join("&");
  },
  remap_status: (value) => {
    if (value == "معاملات جارية") return "running";
    if (value == "معاملات معتذر عنها" || value == "معاملات مرفوضة")
      return "rejected";
    if (value == "معاملات منتهية") return "finished";
    if (value == "المدخلات") return "inputs";
    if (value == "المخرجات") return "outputs";
  },
};

const keys = {
  submissionType: [
    {
      name: "معاملات جارية",
      key: "running",
    },
    {
      name: "معاملات معتذر عنها",
      key: "rejected",
    },
    {
      name: "معاملات منتهية",
      key: "finished",
    },
  ],
  InOutkeys: [
    {
      name: "المدخلات",
      key: "input",
    },
    {
      name: "المخرجات",
      key: "output",
    },
  ],
  RequesrsKeys: [
    {
      name: "عدد المعاملات",
      key: "count",
    },
  ],
};

export function GetProvinceStatistics(
  useurl,
  usename,
  config = {},
  useprops = {}
) {
  const props = this ? this.props : useprops;
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    //setCurrentChart,
    setChartsDates,
    t,
    appId,
  } = props;

  let url = sectionUrl ? sectionUrl : useurl;
  let sectionName = usename ? usename : name;

  if (!results || config) {
    setLoading(true);
    fetchData(`${url}${commonFunctions.encodeQueryData(config)}`).then(
      (data) => {
        keys.submissionType.map((r) => {
          if (r.key == "rejected" && appId == 26) {
            r.name = "معاملات مرفوضة";
          }
          return r;
        });
        var chart2 = _.chain(keys.submissionType)
          .map((d) => {
            return {
              key: d.name,
              values: _.map(data, (counts, index) => {
                var type, typeId;
                if ([1928, 1949, 1929].indexOf(counts.id) != -1) {
                  type = counts.name;
                  typeId = counts.id;
                } else {
                  type =
                    ([2148, 1968, 2048, 2068].indexOf(counts.id) != -1 &&
                      data.find((item) => item.id == 1928).name) ||
                    ([2190, 1971].indexOf(counts.id) != -1 &&
                      data.find((item) => item.id == 1949).name) ||
                    ([1970].indexOf(counts.id) != -1 &&
                      data.find((item) => item.id == 1929).name) ||
                    "الإجماليات";
                  typeId =
                    ([2148, 1968, 2048, 2068].indexOf(counts.id) != -1 &&
                      data.find((item) => item.id == 1928).id) ||
                    ([2190, 1971].indexOf(counts.id) != -1 &&
                      data.find((item) => item.id == 1949).id) ||
                    ([1970].indexOf(counts.id) != -1 &&
                      data.find((item) => item.id == 1929).id) ||
                    "الإجماليات";
                }
                return {
                  x: type,
                  y: counts[d.key],
                  key: index,
                  id: typeId,
                };
              }),
            };
          })
          .value()
          .map((item) => {
            let result = [];
            item.values
              .filter((type) => type.id != 1929)
              .map((value) => {
                var newItemIndex = result.findIndex(
                  (item) => item.x == value.x
                );
                if (newItemIndex == -1) {
                  result.push({ x: value.x, y: value.y });
                } else {
                  result[newItemIndex].y += value.y;
                }
                return value;
              });

            return { key: item.key, values: result };
          });

        var data = [];
        chart2.forEach((chart) => {
          var key = commonFunctions.remap_status(chart.key);
          chart.values.forEach((value) => {
            var temp = {
              key: value.x,
            };
            temp[key] = value.y || 0;
            var target_data = data.find((d) => {
              return d.key == temp.key;
            });
            if (target_data) {
              _.extend(target_data, temp);
            } else {
              data.push(temp);
            }
          });
        });

        const recievedData = {
          data: {
            labels: data.map((val) => (!val.key && "") || val.key),
            datasets: map(chart2, (val, index) => {
              val.values = val.values.map((r) => {
                r.y = r.y == 0 ? "٠" : r.y;
                return r;
              });
              return {
                key: index,
                label: val.key,
                data:
                  (val.values &&
                    val.values.length > 0 && [
                      ...new Map(
                        val.values.map((item) => [item["x"], item])
                      ).values(),
                    ]) ||
                  [],
                backgroundColor: backGroundColors[index],
                hoverBackgroundColor: hoverColors[index],
              };
            }),
          },
          results: data.map((value, key) => {
            Object.keys(value).forEach((key) => {
              if (isNumber(value[key])) {
                value[key] = value[key] == 0 ? "٠" : value[key];
              }
            });
            return {
              key: key,
              id: key,
              processes_kind: value.key,
              ...value,
            };
          }),
        };

        setChartData(recievedData, sectionName);
        if (!_.isEmpty(config) && setChartsDates) {
          setChartsDates(config.from, config.to);
        }
        setLoading(false);
      }
    );
  }
}

export function GetEngCompanyRequestsStatistics(
  useurl,
  usename,
  config = {},
  useprops = {}
) {
  const props = this ? this.props : useprops;
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    setChartsDates,
    //setCurrentChart,
    t,
  } = props;
  let url = sectionUrl ? sectionUrl : useurl;
  let sectionName = usename ? usename : name;

  if (!results || config) {
    setLoading(true);

    fetchData(url, { params: { ...config } }).then((data) => {
      var result = [];
      data.reduce((res, value) => {
        if (!res[value.name]) {
          res[value.name] = { name: value.name, count: 0 };
          result.push(res[value.name]);
        }
        res[value.name].count += value.count;
        return res;
      }, {});

      const recievedData = {
        data: {
          labels: result.map((val) => val.name),
          datasets: [
            {
              data: result.map((v) => (v.count == 0 && "٠") || v.count),
              backgroundColor: slice(backGroundColors, 0, result.length),
              hoverBackgroundColor: slice(hoverColors, 0, result.length),
            },
          ],
        },
        results: result.map((value, key) => {
          return {
            color_key: (
              <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: backGroundColors[key] }}
              ></Button>
            ),
            key: key,
            id: key,
            ...value,
          };
        }),
      };
      setChartData(recievedData, sectionName);
      if (!_.isEmpty(config) && setChartsDates) {
        setChartsDates(config.from, config.to);
      }
      setLoading(false);
    });
  }
}

export function getAllStatisticsKind() {
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    //setCurrentChart,
    t,
  } = this.props;
  //setCurrentChart(name);
  if (!results) {
    setLoading(true);
    fetchData(sectionUrl).then((data) => {
      const recievedData = {
        data: {
          labels: data.map((val) => val.work_flow[0].name),
          datasets: map(data, (val, index) => {
            const label = map(val, (v, k) => k)[index];
            return {
              key: index,
              label: t(label + "Processes"),
              data: data.map((v) => v[label]),
              backgroundColor: backGroundColors[index],
              hoverBackgroundColor: hoverColors[index],
            };
          }),
        },
        results: data.map((value, key) => {
          return {
            key: key,
            id: key,
            processes_kind: value.work_flow[0].name,
            ...value,
          };
        }),
      };
      setChartData(recievedData, name);
      setLoading(false);
    });
  }
}

export function getAllStatisticsByDate() {
  const { sectionUrl, results, setLoading, setChartData, t } = this.props;

  if (!results) {
    setLoading(true);
    fetchData(sectionUrl).then((data) => {
      const labels = ["input", "output"];
      const types = map(data[0].Data, (v) => v.workFlow.name);
      const dates = data.map((v) => v.Key.date).sort();
      const dataSorted = sortBy(data, (v) => v.Key.date);

      const recievedData = {
        data: {
          labels: data.map((val) => val.Key.date),

          datasets: map(labels, (val, index) => {
            return {
              key: index,
              label: t(val),
              data: data.map((v) => v[val]),
              backgroundColor: backGroundColors[index + 4],
              hoverBackgroundColor: hoverColors[index + 4],
            };
          }),
        },
        results: data.map((value, key) => {
          return {
            key: key,
            id: key,
            date: value.Key.date,
            ...value,
          };
        }),
      };

      types.map((type, index) => {
        const recievedData2 = {
          data: {
            labels: dates,

            datasets: map(labels, (label, key) => {
              return {
                key: key,
                label: t(label),
                data: dataSorted.map((single) => {
                  return get(
                    find(single.Data, (v) => v.workFlow.name.includes(type)),
                    label,
                    0
                  );
                }),
                backgroundColor: backGroundColors[key + 4],
                hoverBackgroundColor: hoverColors[key + 4],
              };
            }),
          },
          results: data.map((value, key) => {
            let chosenType = find(value.Data, (v) =>
              v.workFlow.name.includes(type)
            );
            return {
              key: key,
              id: key,
              input: get(chosenType, "input", 0),
              output: get(chosenType, "output", 0),
              total: get(chosenType, "count", 0),
              date: value.Key.date,
            };
          }),
        };
        setChartData(recievedData2, `illustrationYearChart${index}`);
      });

      setChartData(recievedData, "illustrationYearChart");
      setLoading(false);
    });
  }
}

export function getAllProvStatistics(
  useurl,
  usename,
  config = {},
  useprops = {}
) {
  const props = this ? this.props : useprops;
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    //setCurrentChart,
    setChartsDates,
    t,
  } = props;

  let url = sectionUrl ? sectionUrl : useurl;
  let sectionName = usename ? usename : name;

  if (!results || config) {
    setLoading(true);
    fetchData(url, { params: { ...config } }).then((data) => {
      const recievedData = {
        data: {
          name: "أمانة منطقة الرياض",
          children: data.map((singledata, index) => {
            return {
              name: singledata.name,
              size: singledata.total,
              key: index,
              children: singledata.Data.map((singleData, childIndex) => {
                const eng_compData = [
                  ...new Map(
                    singleData.eng_comp.map((item) => [
                      item["eng_comp"] && item["eng_comp"]["id"],
                      item,
                    ])
                  ).values(),
                ];
                return {
                  name: singleData.workFlow.name,
                  size: _.reduce(
                    eng_compData,
                    function (m, d) {
                      return m + +d.count;
                    },
                    0
                  ),
                  key: childIndex,
                  children: eng_compData.map((engComp, leafIndex) => {
                    //[0].eng_comp.id
                    return {
                      name: (engComp.eng_comp && engComp.eng_comp.name) || "",
                      size: engComp.count,
                      key: leafIndex,
                      // backgroundColor: backGroundColors[leafIndex],
                      // hoverBackgroundColor: hoverColors[leafIndex],
                    };
                  }),
                  // backgroundColor: backGroundColors[childIndex],
                  // hoverBackgroundColor: hoverColors[childIndex],
                };
              }),
              // backgroundColor: backGroundColors[index],
              // hoverBackgroundColor: hoverColors[index],
            };
          }),
        },
        results: data.map((singledata, index) => {
          return {
            key: index,
            id: index,
            municipality_name: singledata.name || "أمانة منطقة الرياض",
            number: singledata.total,
          };
        }),
      };
      setChartData(recievedData, sectionName);
      if (!_.isEmpty(config) && setChartsDates) {
        setChartsDates(config.from, config.to);
      }
      setLoading(false);
    });
  }
}

export function getLandUsageStatistics(
  useurl,
  usename,
  config = {},
  useprops = {}
) {
  const props = this ? this.props : useprops;
  const {
    name,
    sectionUrl,
    results,
    setLoading,
    setChartData,
    //setCurrentChart,
    setChartsDates,
    t,
  } = props;

  let url = sectionUrl ? sectionUrl : useurl;
  let sectionName = usename ? usename : name;

  if (!results || config) {
    setLoading(true);
    fetchData(url, { params: { ...config } }).then((data) => {
      const recievedData = {
        data: {
          labels: data.map((v) => v.name),
          datasets: [
            {
              data: data.map((v) => v.total),
              backgroundColor: slice(backGroundColors, 3, data.length + 3),
              hoverBackgroundColor: slice(hoverColors, 3, data.length + 3),
            },
          ],
        },
        results: data.map((value, key) => {
          return {
            key: key,
            id: key,
            land_usage: value.name,
            number: value.total,
          };
        }),
      };
      setChartData(recievedData, sectionName);
      if (!_.isEmpty(config) && setChartsDates) {
        setChartsDates(config.from, config.to);
      }
      setLoading(false);
    });
  }
}
