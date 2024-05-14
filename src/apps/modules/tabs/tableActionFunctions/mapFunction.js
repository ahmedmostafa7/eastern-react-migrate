import { forEach, isEmpty, isBoolean, isNumber } from "lodash";
import { v4 as uuidv4 } from "uuid";
function isNumeric(num) {
  return !isNaN(num);
}

const doSomeChecks = (mainObject) => {
  if (mainObject) {
    Object.keys(mainObject).forEach((key) => {
      //
      if (!isNumeric(key) && key != "user") {
        if (
          mainObject[key] &&
          !Array.isArray(mainObject[key]) &&
          typeof mainObject[key] == "object"
        ) {
          doSomeChecks(mainObject[key]);
        } else if (mainObject[key] && Array.isArray(mainObject[key])) {
          mainObject[key].forEach((item, index) => {
            doSomeChecks(item);
          });
        } else if (mainObject[key] && typeof mainObject[key] == "string") {
          mainObject[key] = isAbsoluteUrl(mainObject[key]);
        }
      }
    });
  }
  return mainObject;
};

const isAbsoluteUrl = (str) => {
  if (str.indexOf("SubAttachments") != -1) {
    return `/${str.substring(str.indexOf("SubAttachments"), str.length)}`;
  } else return str;
};

function isObject(val) {
  return val instanceof Object;
}

export const buildMapObjectsPaths = (mapObject, str, objectPaths, keysSide) => {
  if (!isEmpty(mapObject)) {
    Object.keys(mapObject).forEach((key) => {
      if (isObject(mapObject[key])) {
        if (!Array.isArray(mapObject[key])) {
          buildMapObjectsPaths(
            mapObject[key],
            !isEmpty(str) ? `${str}.${key}` : `${key}`,
            objectPaths
          );
        } else if (Array.isArray(mapObject[key])) {
          mapObject[key].forEach((item, index) => {
            buildMapObjectsPaths(
              item,
              !isEmpty(str) ? `${str}.${key}` : `${key}`,
              objectPaths
            );
          });
        }
      }
      objectPaths.push(`{'${str}.${key}' : ''}`);
    });
  }
};

const setProperty = (obj, keyPath, value) => {
  if (typeof obj[keyPath.split(".")[0]] == "object") {
    setProperty(
      obj[keyPath.split(".")[0]],
      keyPath.split(".").splice(0, 1).join("."),
      value
    );
  } else {
    obj[keyPath.split(".")[0]] = value;
  }
};

function stringContainsNumber(_string) {
  return /\d/.test(_string);
}

export const checkObjectsAvailability = (oldMain, newMain, objects) => {
  let i = 0;
  objects.forEach((object) => {
    if (!object.isMandatory) {
      Object.keys(object).map((key, index) => {
        if (!oldMain[key] && newMain[object[key]]) {
          delete newMain[object[key]];
          ++i;
        }
      });
    }
  });

  console.log("Count of deleted Objects", i);
};

export const mapOldMainObject = (oldMain, emptyMain, objectPaths) => {
  let newMain = JSON.parse(JSON.stringify(emptyMain));

  oldMain = doSomeChecks(oldMain);
  let newValue;
  objectPaths.forEach((path) => {
    if (
      newMain.hasOwnProperty(Object.keys(path)[0].split(".")[0]) &&
      typeof path == "object"
    ) {
      if (
        !path.groupBy &&
        !path.fields &&
        !path.selectedIndex &&
        !path.commentFields
      ) {
        Object.keys(path)
          .filter(
            (key) =>
              key != "selectedIndex" &&
              key != "commentFields" &&
              key != "fields" &&
              key != "groupBy" &&
              key != "isUUID" &&
              key != "copyAllFields"
          )
          .forEach((key) => {
            //
            key.split(".").reduce((r, y, keyIndex) => {
              //
              if (
                keyIndex == key.split(".").length - 1 &&
                path[key].toString().indexOf("|") == -1
              ) {
                try {
                  if (
                    (isObject(r[y]) || r[y] == undefined || r[y] == null) &&
                    !Array.isArray(r[y])
                  ) {
                    r[y] =
                      path[key]
                        .toString()
                        .split(".")
                        .reduce((o, i) => (i && o[i]) || (!i && o), oldMain) ||
                      oldMain[path[key].toString()] ||
                      (isNumeric(path[key].toString())
                        ? +path[key]
                        : Array.isArray(r[y])
                        ? []
                        : path[key].toString().split(".").length > 1
                        ? null
                        : path[key]);
                  } else if (isObject(r[y]) && Array.isArray(r[y])) {
                    r[y].push(
                      path[key]
                        .toString()
                        .split(".")
                        .reduce((o, i) => (i && o[i]) || (!i && o), oldMain) ||
                        oldMain[path[key].toString()] ||
                        (isNumeric(path[key].toString())
                          ? +path[key]
                          : Array.isArray(r[y])
                          ? []
                          : path[key].toString().split(".").length > 1
                          ? null
                          : path[key])
                    );
                  }
                } catch (error) {
                  //
                }
              } else if (
                keyIndex == key.split(".").length - 1 &&
                path[key].toString().indexOf("|") != -1 &&
                Array.isArray(
                  path[key]
                    .toString()
                    .split("|")[0]
                    .split(".")
                    .reduce((o, i) => (i && o[i]) || (!i && o), oldMain)
                )
              ) {
                if (!isNumeric(path[key].toString().split("|")[1])) {
                  path[key]
                    .toString()
                    .split("|")[0]
                    .split(".")
                    .reduce((o, i) => (i && o[i]) || (!i && o), oldMain)
                    .forEach((item, index) => {
                      r[!stringContainsNumber(y) ? y + index : y] =
                        path[key]
                          .toString()
                          .split("|")[1]
                          .split(".")
                          .reduce((e, z) => e[z], item) ||
                        item[path[key].toString().split("|")[1]]; //|| (isNumeric(path[key].toString().split('|')[1]) ? +path[key].toString().split('|')[1] : path[key].toString().split('|')[1]);
                    });
                } else {
                  if (!Array.isArray(r[y]))
                    r[y] = path[key]
                      .toString()
                      .split("|")[0]
                      .split(".")
                      .reduce((o, i) => (i && o[i]) || (!i && o), oldMain)[
                      path[key].toString().split("|")[1]
                    ];
                  else
                    r[y].push(
                      path[key]
                        .toString()
                        .split("|")[0]
                        .split(".")
                        .reduce((o, i) => (i && o[i]) || (!i && o), oldMain)[
                        path[key].toString().split("|")[1]
                      ]
                    );
                }
              } else if (
                keyIndex < key.split(".").length - 1 &&
                r[y] == undefined
              ) {
                r[y] = {};
              }

              return r[y];
            }, newMain);
          });
      } else if (
        !path.groupBy &&
        !path.fields &&
        path.selectedIndex &&
        !path.commentFields
      ) {
        Object.keys(path)
          .filter(
            (key) =>
              key != "selectedIndex" &&
              key != "commentFields" &&
              key != "fields" &&
              key != "groupBy" &&
              key != "isUUID" &&
              key != "copyAllFields"
          )
          .forEach((key) => {
            key.split(".").reduce((r, y, keyindex) => {
              if (keyindex == key.split(".").length - 1) {
                if (!r[y] || (r[y] && !Array.isArray(r[y]))) {
                  r[y] = isObject(r[y]) ? r[y] : {};
                  path[key].split(".").reduce((o, i, subkeyIndex) => {
                    if (
                      subkeyIndex == path[key].split(".").length - 1 &&
                      o &&
                      typeof ((i && o[i]) || (!i && o)) == "object" &&
                      Array.isArray((i && o[i]) || (!i && o))
                    ) {
                      var index =
                        (isNumeric(path.selectedIndex) && path.selectedIndex) ||
                        path.selectedIndex
                          .split(".")
                          .reduce((g, u) => g[u], oldMain);
                      index =
                        ((i && o[i]) || (!i && o)).length == index
                          ? index - 1
                          : index;
                      r[y] = ((i && o[i]) || (!i && o))[index];
                    }

                    return (o && ((i && o[i]) || (!i && o))) || undefined;
                  }, oldMain);
                } else if (Array.isArray(r[y])) {
                  var obj = {};
                  path[key].split(".").reduce((o, i, subkeyIndex) => {
                    if (
                      subkeyIndex == path[key].split(".").length - 1 &&
                      o &&
                      typeof ((i && o[i]) || (!i && o)) == "object" &&
                      Array.isArray((i && o[i]) || (!i && o))
                    ) {
                      var index =
                        (isNumeric(path.selectedIndex) && path.selectedIndex) ||
                        path.selectedIndex
                          .split(".")
                          .reduce((g, u) => g[u], oldMain);
                      index =
                        ((i && o[i]) || (!i && o)).length == index
                          ? index - 1
                          : index;
                      obj = ((i && o[i]) || (!i && o))[index];
                    }
                    return (o && ((i && o[i]) || (!i && o))) || undefined;
                  }, oldMain);

                  r[y].push(obj);
                }
              } else if (
                keyindex < key.split(".").length - 1 &&
                r[y] == undefined
              ) {
                r[y] = {};
              }

              return r[y];
            }, newMain);
          });
      } else if (path.groupBy && !path.fields && !path.commentFields) {
        Object.keys(path)
          .filter(
            (key) =>
              key != "selectedIndex" &&
              key != "fields" &&
              key != "commentFields" &&
              key != "groupBy" &&
              key != "isUUID" &&
              key != "copyAllFields"
          )
          .forEach((key) => {
            key.split(".").reduce((r, y, keyindex) => {
              if (keyindex == key.split(".").length - 1) {
                r[y] = isObject(r[y]) ? r[y] : {};
                path[key].split(".").reduce((o, i, subkeyIndex) => {
                  if (
                    subkeyIndex == path[key].split(".").length - 1 &&
                    o &&
                    typeof ((i && o[i]) || (!i && o)) == "object" &&
                    Array.isArray((i && o[i]) || (!i && o))
                  ) {
                    if (!path.selectedIndex) {
                      ((i && o[i]) || (!i && o)).forEach((record) => {
                        if (record[path.groupBy])
                          r[y][record[path.groupBy]] = record;
                        else if (path.isUUID) {
                          r[y][uuid()] = record;
                        } else r[y] = record;
                      });
                    } else {
                      var index =
                        (isNumeric(path.selectedIndex) && path.selectedIndex) ||
                        path.selectedIndex
                          .split(".")
                          .reduce((g, u) => g[u], oldMain);
                      index =
                        ((i && o[i]) || (!i && o)).length == index
                          ? index - 1
                          : index;
                      if (((i && o[i]) || (!i && o))[index][path.groupBy])
                        r[y][((i && o[i]) || (!i && o))[index][path.groupBy]] =
                          record;
                      else if (path.isUUID) {
                        r[y][uuid()] = record;
                      } else r[y] = record;
                      //r[y][(i && o[i] || !i && o)[index][path.groupBy]] = (i && o[i] || !i && o)[index];
                    }
                  }

                  return (o && ((i && o[i]) || (!i && o))) || undefined;
                }, oldMain);
              }

              return r[y];
            }, newMain);
          });
      } else if (!path.groupBy && path.fields && !path.commentFields) {
        Object.keys(path)
          .filter(
            (key) =>
              key != "selectedIndex" &&
              key != "fields" &&
              key != "commentFields" &&
              key != "groupBy" &&
              key != "isUUID" &&
              key != "copyAllFields"
          )
          .forEach((key) => {
            key.split(".").reduce((r, y, keyindex) => {
              //
              if (
                keyindex == key.split(".").length - 1 &&
                typeof r[y] == "object" &&
                Array.isArray(r[y])
              ) {
                //r[y] = [];
                var obj = {};
                let isSet = false;
                path[key].split(".").reduce((o, i, subkeyIndex) => {
                  if (
                    subkeyIndex == path[key].split(".").length - 1 &&
                    o &&
                    typeof ((i && o[i]) || (!i && o)) == "object" &&
                    Array.isArray((i && o[i]) || (!i && o))
                  ) {
                    if (!path.selectedIndex) {
                      ((i && o[i]) || (!i && o)).forEach((record) => {
                        obj =
                          (isObject(record) &&
                            ((path.copyAllFields && { ...record }) || {})) ||
                          "";

                        Object.keys(path.fields).forEach((field, index) => {
                          if (typeof field == "string" && isEmpty(field)) {
                            //obj = !Array.isArray(obj) && [] || obj;
                            r[y].push(
                              !isBoolean(path.fields[field]) &&
                                !isNumber(path.fields[field])
                                ? (path.fields[field].toString().split(".")
                                    .length > 1 &&
                                    path.fields[field]
                                      .split(".")
                                      .reduce((u, h) => u && u[h], record)) ||
                                    (path.fields[field] != "$index"
                                      ? record[path.fields[field]]
                                      : r[y].length + 1)
                                : path.fields[field]
                            );
                            isSet = true;
                          } else if (field.split(".").length == 1) {
                            if (isObject(obj)) {
                              obj[field] =
                                !isBoolean(path.fields[field]) &&
                                !isNumber(path.fields[field])
                                  ? (path.fields[field].toString().split(".")
                                      .length > 1 &&
                                      path.fields[field]
                                        .split(".")
                                        .reduce((u, h) => u && u[h], record)) ||
                                    (path.fields[field] != "$index"
                                      ? record[path.fields[field]]
                                      : r[y].length + 1)
                                  : path.fields[field];

                              if (obj[field] == undefined) delete obj[field];
                            } else {
                              obj =
                                !isBoolean(path.fields[field]) &&
                                !isNumber(path.fields[field])
                                  ? (path.fields[field].toString().split(".")
                                      .length > 1 &&
                                      path.fields[field]
                                        .split(".")
                                        .reduce((u, h) => u && u[h], record)) ||
                                    (path.fields[field] != "$index"
                                      ? record[path.fields[field]]
                                      : r[y].length + 1)
                                  : path.fields[field];
                            }
                          } else {
                            field.split(".").reduce((e, f, fIndx) => {
                              if (fIndx == field.split(".").length - 1) {
                                var mappedValue =
                                  !isBoolean(path.fields[field]) &&
                                  !isNumber(path.fields[field])
                                    ? (path.fields[field].toString().split(".")
                                        .length > 1 &&
                                        path.fields[field]
                                          .split(".")
                                          .reduce(
                                            (u, h) => u && u[h],
                                            record
                                          )) ||
                                      (path.fields[field] != "$index"
                                        ? record[path.fields[field]]
                                        : r[y].length + 1)
                                    : path.fields[field];

                                if (!f) {
                                  e = mappedValue;
                                } else {
                                  if (mappedValue == undefined) delete e[f];
                                  else e[f] = mappedValue;
                                }
                              } else {
                                if (
                                  typeof e == "object" &&
                                  ((e && Object.values(e).length == 0) ||
                                    e[f] == undefined)
                                ) {
                                  e[f] = {};
                                }
                              }

                              return e && ((f && e[f]) || (!f && e));
                            }, obj);
                          }
                        });

                        if (!isSet) r[y].push(obj);
                      });
                    } else {
                      var index =
                        (isNumeric(path.selectedIndex) && path.selectedIndex) ||
                        path.selectedIndex
                          .split(".")
                          .reduce((g, u) => g[u], oldMain);
                      index =
                        ((i && o[i]) || (!i && o)).length == index
                          ? index - 1
                          : index;
                      obj =
                        (isObject(o[i]) &&
                          ((path.copyAllFields && { ...o[i] }) || {})) ||
                        "";
                      Object.keys(path.fields).forEach((field) => {
                        if (field.split(".").length == 1) {
                          if (isObject(obj)) {
                            obj[field] =
                              !isBoolean(path.fields[field]) &&
                              !isNumber(path.fields[field])
                                ? (path.fields[field].toString().split(".")
                                    .length > 1 &&
                                    path.fields[field]
                                      .split(".")
                                      .reduce(
                                        (u, h) => u && u[h],
                                        ((i && o[i]) || (!i && o))[index]
                                      )) ||
                                  (path.fields[field] != "$index"
                                    ? ((i && o[i]) || (!i && o))[index][
                                        path.fields[field]
                                      ]
                                    : r[y].length + 1)
                                : path.fields[field];

                            if (obj[field] == undefined) delete obj[field];
                          } else {
                            obj =
                              !isBoolean(path.fields[field]) &&
                              !isNumber(path.fields[field])
                                ? (path.fields[field].toString().split(".")
                                    .length > 1 &&
                                    path.fields[field]
                                      .split(".")
                                      .reduce(
                                        (u, h) => u && u[h],
                                        ((i && o[i]) || (!i && o))[index]
                                      )) ||
                                  (path.fields[field] != "$index"
                                    ? ((i && o[i]) || (!i && o))[index][
                                        path.fields[field]
                                      ]
                                    : r[y].length + 1)
                                : path.fields[field];
                          }
                        } else {
                          field.split(".").reduce((e, f, fIndx) => {
                            if (fIndx == field.split(".").length - 1) {
                              var mappedValue =
                                !isBoolean(path.fields[field]) &&
                                !isNumber(path.fields[field])
                                  ? (path.fields[field].toString().split(".")
                                      .length > 1 &&
                                      path.fields[field]
                                        .split(".")
                                        .reduce(
                                          (u, h) => u && u[h],
                                          ((i && o[i]) || (!i && o))[index]
                                        )) ||
                                    (path.fields[field] != "$index"
                                      ? ((i && o[i]) || (!i && o))[index][
                                          path.fields[field]
                                        ]
                                      : r[y].length + 1)
                                  : path.fields[field];

                              if (!f) {
                                e = mappedValue;
                              } else {
                                if (mappedValue == undefined) delete e[f];
                                else e[f] = mappedValue;
                              }
                            } else {
                              if (
                                typeof e == "object" &&
                                ((e && Object.values(e).length == 0) ||
                                  e[f] == undefined)
                              ) {
                                e[f] = {};
                              }
                            }
                            return e && ((f && e[f]) || (!f && e));
                          }, obj);
                        }
                      });
                      r[y].push(obj);
                    }
                  } else if (
                    subkeyIndex == path[key].split(".").length - 1 &&
                    o &&
                    ((i && o[i]) || (!i && o)) != undefined
                  ) {
                    obj =
                      (isObject(o[i]) &&
                        ((path.copyAllFields && { ...o[i] }) || {})) ||
                      "";
                    Object.keys(path.fields).forEach((field, index) => {
                      if (field.split(".").length == 1) {
                        if (isObject(obj)) {
                          obj[field] =
                            !isBoolean(path.fields[field]) &&
                            !isNumber(path.fields[field])
                              ? (path.fields[field].toString().split(".")
                                  .length > 1 &&
                                  path.fields[field]
                                    .split(".")
                                    .reduce(
                                      (u, h) => u && u[h],
                                      (i && o[i]) || (!i && o)
                                    )) ||
                                (path.fields[field] != "$index"
                                  ? ((i && o[i]) || (!i && o))[
                                      path.fields[field]
                                    ]
                                  : r[y].length + 1)
                              : path.fields[field];

                          if (obj[field] == undefined) delete obj[field];
                        } else {
                          obj =
                            !isBoolean(path.fields[field]) &&
                            !isNumber(path.fields[field])
                              ? (path.fields[field].toString().split(".")
                                  .length > 1 &&
                                  path.fields[field]
                                    .split(".")
                                    .reduce(
                                      (u, h) => u && u[h],
                                      (i && o[i]) || (!i && o)
                                    )) ||
                                (path.fields[field] != "$index"
                                  ? ((i && o[i]) || (!i && o))[
                                      path.fields[field]
                                    ]
                                  : r[y].length + 1)
                              : path.fields[field];
                        }
                      } else {
                        field.split(".").reduce((e, f, fIndx) => {
                          if (fIndx == field.split(".").length - 1) {
                            var mappedValue =
                              !isBoolean(path.fields[field]) &&
                              !isNumber(path.fields[field])
                                ? (path.fields[field].toString().split(".")
                                    .length > 1 &&
                                    path.fields[field]
                                      .split(".")
                                      .reduce(
                                        (u, h) => u && u[h],
                                        (i && o[i]) || (!i && o)
                                      )) ||
                                  (path.fields[field] != "$index"
                                    ? ((i && o[i]) || (!i && o))[
                                        path.fields[field]
                                      ]
                                    : r[y].length + 1)
                                : path.fields[field];

                            if (!f) {
                              e = mappedValue;
                            } else {
                              if (mappedValue == undefined) delete e[f];
                              else e[f] = mappedValue;
                            }
                          } else {
                            if (
                              typeof e == "object" &&
                              ((e && Object.values(e).length == 0) ||
                                e[f] == undefined)
                            ) {
                              e[f] = {};
                            }
                          }
                          return e && ((f && e[f]) || (!f && e));
                        }, obj);
                      }
                    });
                    r[y].push(obj);
                  }
                  return (o && ((i && o[i]) || (!i && o))) || undefined;
                }, oldMain);
              } else if (keyindex == key.split(".").length - 1) {
                r[y] = (isObject(r[y]) && r[y]) || {};
                if (path.selectedIndex) {
                  path[key].split(".").reduce((o, i, subkeyIndex) => {
                    if (
                      path[key].split(".").length - 1 == subkeyIndex &&
                      o &&
                      typeof ((i && o[i]) || (!i && o)) == "object" &&
                      Array.isArray((i && o[i]) || (!i && o)) &&
                      ((i && o[i]) || (!i && o)).length
                    ) {
                      var index = isNumeric(path.selectedIndex)
                        ? path.selectedIndex
                        : path.selectedIndex
                            .split(".")
                            .reduce((g, u) => g[u], oldMain);
                      index =
                        ((i && o[i]) || (!i && o)).length == index
                          ? index - 1
                          : index;

                      Object.keys(path.fields).forEach((field) => {
                        if (field && field.split(".").length == 1) {
                          r[y][field] =
                            !isBoolean(path.fields[field]) &&
                            !isNumber(path.fields[field])
                              ? (path.fields[field].toString().split(".")
                                  .length > 1 &&
                                  path.fields[field]
                                    .split(".")
                                    .reduce(
                                      (u, h) => u && u[h],
                                      ((i && o[i]) || (!i && o))[index]
                                    )) ||
                                (path.fields[field] != "$index"
                                  ? ((i && o[i]) || (!i && o))[index][
                                      path.fields[field]
                                    ]
                                  : r[y].length + 1)
                              : path.fields[field];

                          if (r[y][field] == undefined) delete r[y][field];
                        } else if (!field) {
                          r[y] =
                            !isBoolean(path.fields[field]) &&
                            !isNumber(path.fields[field])
                              ? (path.fields[field].toString().split(".")
                                  .length > 1 &&
                                  path.fields[field]
                                    .split(".")
                                    .reduce(
                                      (u, h) => u && u[h],
                                      ((i && o[i]) || (!i && o))[index]
                                    )) ||
                                (path.fields[field] != "$index"
                                  ? ((i && o[i]) || (!i && o))[index][
                                      path.fields[field]
                                    ]
                                  : r[y].length + 1)
                              : path.fields[field];
                        } else {
                          field.split(".").reduce((e, f, fIndx) => {
                            if (fIndx == field.split(".").length - 1) {
                              var mappedValue =
                                !isBoolean(path.fields[field]) &&
                                !isNumber(path.fields[field])
                                  ? (path.fields[field].toString().split(".")
                                      .length > 1 &&
                                      path.fields[field]
                                        .split(".")
                                        .reduce(
                                          (u, h) => u && u[h],
                                          ((i && o[i]) || (!i && o))[index]
                                        )) ||
                                    (path.fields[field] != "$index"
                                      ? ((i && o[i]) || (!i && o))[index][
                                          path.fields[field]
                                        ]
                                      : r[y].length + 1)
                                  : path.fields[field];

                              if (!f) {
                                e = mappedValue;
                              } else {
                                if (mappedValue == undefined) delete e[f];
                                else e[f] = mappedValue;
                              }
                            } else {
                              if (
                                typeof e == "object" &&
                                ((e && Object.values(e).length == 0) ||
                                  e[f] == undefined)
                              ) {
                                e[f] = {};
                              }
                            }
                            return e && ((f && e[f]) || (!f && e));
                          }, r[y]);
                        }
                      });
                    }
                    return (o && ((i && o[i]) || (!i && o))) || undefined;
                  }, oldMain);
                } else {
                  Object.keys(path.fields).forEach((field, index) => {
                    //r[y][field] = path.fields[field].split('.').length > 1 ? path.fields[field].split('.').reduce((u, h) => u && u[h], oldMain) : oldMain[path.fields[field]];
                    if (field && field.split(".").length == 1) {
                      path[key].split(".").reduce((o, i, subkeyIndex) => {
                        if (
                          path[key].split(".").length - 1 == subkeyIndex &&
                          o &&
                          typeof ((i && o[i]) || (!i && o)) == "object"
                        ) {
                          r[y][field] =
                            (path.fields[field].toString().split(".").length >
                              1 &&
                              path.fields[field]
                                .split(".")
                                .reduce(
                                  (u, h) => u && u[h],
                                  (i && o[i]) || (!i && o)
                                )) ||
                            ((i && o[i]) || (!i && o))[path.fields[field]];

                          if (r[y][field] == undefined) delete r[y][field];
                        }
                        return (
                          (o && ((i && o[i]) || (!i && o))) ||
                          (!path[key] && oldMain) ||
                          undefined
                        );
                      }, oldMain);
                    } else {
                      field.split(".").reduce((e, f, fIndx) => {
                        if (fIndx == field.split(".").length - 1) {
                          path[key].split(".").reduce((o, i, subkeyIndex) => {
                            if (
                              path[key].split(".").length - 1 == subkeyIndex &&
                              o &&
                              typeof ((i && o[i]) || (!i && o)) == "object"
                            ) {
                              var mappedValue =
                                typeof path.fields[field] != "boolean" &&
                                isNaN(path.fields[field])
                                  ? (path.fields[field].toString().split(".")
                                      .length > 1 &&
                                      path.fields[field]
                                        .split(".")
                                        .reduce(
                                          (u, h) => u && u[h],
                                          (i && o[i]) || (!i && o)
                                        )) ||
                                    ((i && o[i]) || (!i && o))[
                                      path.fields[field]
                                    ]
                                  : path.fields[field];

                              if (!f) {
                                e = mappedValue;
                              } else {
                                if (mappedValue == undefined) delete e[f];
                                else e[f] = mappedValue;
                              }
                            }
                            return (
                              (o && ((i && o[i]) || (!i && o))) ||
                              (!path[key] && oldMain) ||
                              undefined
                            );
                          }, oldMain);
                        } else {
                          if (
                            typeof e == "object" &&
                            ((e && Object.values(e).length == 0) ||
                              e[f] == undefined)
                          ) {
                            e[f] = {};
                          }
                        }
                        return e && ((f && e[f]) || (!f && e));
                      }, r[y]);
                    }
                  });
                }
              }

              return r[y];
            }, newMain);
          });
      } else if (path.groupBy && path.fields && !path.commentFields) {
        var uid;
        Object.keys(path)
          .filter(
            (key) =>
              key != "selectedIndex" &&
              key != "commentFields" &&
              key != "fields" &&
              key != "groupBy" &&
              key != "isUUID" &&
              key != "copyAllFields"
          )
          .forEach((key) => {
            key.split(".").reduce((r, y, keyindex) => {
              if (keyindex == key.split(".").length - 1) {
                // r[y] = [];
                var obj = {};
                path[key].split(".").reduce((o, i, subkeyIndex) => {
                  if (
                    subkeyIndex == path[key].split(".").length - 1 &&
                    o &&
                    typeof ((i && o[i]) || (!i && o)) == "object" &&
                    Array.isArray((i && o[i]) || (!i && o))
                  ) {
                    if (!path.selectedIndex) {
                      ((i && o[i]) || (!i && o)).forEach((record) => {
                        uid = uuid();
                        obj =
                          (isObject(record) &&
                            ((path.copyAllFields && { ...record }) || {})) ||
                          "";
                        Object.keys(path.fields).forEach((field, index) => {
                          if (field.split(".").length == 1) {
                            if (isObject(obj)) {
                              obj[field] =
                                !isBoolean(path.fields[field]) &&
                                !isNumber(path.fields[field])
                                  ? (path.fields[field].toString().split(".")
                                      .length > 1 &&
                                      path.fields[field]
                                        .split(".")
                                        .reduce((u, h) => u && u[h], record)) ||
                                    record[path.fields[field]] ||
                                    (path.fields[field] == path.groupBy &&
                                      path.isUUID &&
                                      uid) ||
                                    (path.fields[field] == "$index" &&
                                      r[y].length + 1)
                                  : path.fields[field];

                              if (obj[field] == undefined) delete obj[field];
                            } else {
                              obj =
                                !isBoolean(path.fields[field]) &&
                                !isNumber(path.fields[field])
                                  ? (path.fields[field].toString().split(".")
                                      .length > 1 &&
                                      path.fields[field]
                                        .split(".")
                                        .reduce((u, h) => u && u[h], record)) ||
                                    record[path.fields[field]] ||
                                    (path.fields[field] == path.groupBy &&
                                      path.isUUID &&
                                      uid) ||
                                    (path.fields[field] == "$index" &&
                                      r[y].length + 1)
                                  : path.fields[field];
                            }
                          } else {
                            field.split(".").reduce((e, f) => {
                              if (f == field.split(".").length - 1) {
                                var mappedValue =
                                  !isBoolean(path.fields[field]) &&
                                  !isNumber(path.fields[field])
                                    ? (path.fields[field].toString().split(".")
                                        .length > 1 &&
                                        path.fields[field]
                                          .split(".")
                                          .reduce(
                                            (u, h) => u && u[h],
                                            record
                                          )) ||
                                      record[path.fields[field]] ||
                                      (path.fields[field] == path.groupBy &&
                                        path.isUUID &&
                                        uid) ||
                                      (path.fields[field] == "$index" &&
                                        r[y].length + 1)
                                    : path.fields[field];

                                if (!f) {
                                  e = mappedValue;
                                } else {
                                  if (mappedValue == undefined) delete e[f];
                                  else e[f] = mappedValue;
                                }
                              }
                              return e && ((f && e[f]) || (!f && e));
                            }, obj);
                          }
                        });

                        if (typeof r[y] == "object" && Array.isArray(r[y])) {
                          if (record[path.groupBy])
                            r[y].push({ [record[path.groupBy]]: obj });
                          else if (!record[path.groupBy]) {
                            r[y].push({ [uid]: obj });
                          } else {
                            r[y].push(isObject(obj) ? { obj } : obj);
                          }
                        } else {
                          if (record[path.groupBy])
                            r[y][record[path.groupBy]] = obj;
                          else if (!record[path.groupBy]) {
                            r[y][uid] = obj;
                          } else {
                            r[y] = obj;
                          }
                        }
                      });
                    } else {
                      uid = uuid();
                      var index =
                        (isNumeric(path.selectedIndex) && path.selectedIndex) ||
                        path.selectedIndex
                          .split(".")
                          .reduce((g, u) => g[u], oldMain);
                      index =
                        ((i && o[i]) || (!i && o)).length == index
                          ? index - 1
                          : index;
                      obj =
                        (isObject(o[i]) &&
                          ((path.copyAllFields && { ...o[i] }) || {})) ||
                        "";
                      Object.keys(path.fields).forEach((field) => {
                        if (field.split(".").length == 1) {
                          if (isObject(obj)) {
                            obj[field] =
                              !isBoolean(path.fields[field]) &&
                              !isNumber(path.fields[field])
                                ? (path.fields[field].toString().split(".")
                                    .length > 1 &&
                                    path.fields[field]
                                      .split(".")
                                      .reduce(
                                        (u, h) => u && u[h],
                                        ((i && o[i]) || (!i && o))[index]
                                      )) ||
                                  ((i && o[i]) || (!i && o))[index][
                                    path.fields[field]
                                  ] ||
                                  (path.fields[field] == path.groupBy &&
                                    path.isUUID &&
                                    uid) ||
                                  (path.fields[field] == "$index" &&
                                    r[y].length + 1)
                                : path.fields[field];

                            if (obj[field] == undefined) delete obj[field];
                          } else {
                            obj =
                              !isBoolean(path.fields[field]) &&
                              !isNumber(path.fields[field])
                                ? (path.fields[field].toString().split(".")
                                    .length > 1 &&
                                    path.fields[field]
                                      .split(".")
                                      .reduce(
                                        (u, h) => u && u[h],
                                        ((i && o[i]) || (!i && o))[index]
                                      )) ||
                                  ((i && o[i]) || (!i && o))[index][
                                    path.fields[field]
                                  ] ||
                                  (path.fields[field] == path.groupBy &&
                                    path.isUUID &&
                                    uid) ||
                                  (path.fields[field] == "$index" &&
                                    r[y].length + 1)
                                : path.fields[field];
                          }
                        } else {
                          field.split(".").reduce((e, f) => {
                            if (f == field.split(".").length - 1) {
                              var mappedValue =
                                !isBoolean(path.fields[field]) &&
                                !isNumber(path.fields[field])
                                  ? (path.fields[field].toString().split(".")
                                      .length > 1 &&
                                      path.fields[field]
                                        .split(".")
                                        .reduce(
                                          (u, h) => u && u[h],
                                          ((i && o[i]) || (!i && o))[index]
                                        )) ||
                                    ((i && o[i]) || (!i && o))[index][
                                      path.fields[field]
                                    ] ||
                                    (path.fields[field] == path.groupBy &&
                                      path.isUUID &&
                                      uid) ||
                                    (path.fields[field] == "$index" &&
                                      r[y].length + 1)
                                  : path.fields[field];

                              if (!f) {
                                e = mappedValue;
                              } else {
                                if (mappedValue == undefined) delete e[f];
                                else e[f] = mappedValue;
                              }
                            }
                            return e && ((f && e[f]) || (!f && e));
                          }, obj);
                        }
                      });
                      //r[y].push({ [record[path.groupBy]]: obj });
                      if (typeof r[y] == "object" && Array.isArray(r[y])) {
                        if (record[path.groupBy])
                          r[y].push({ [record[path.groupBy]]: obj });
                        else if (!record[path.groupBy]) {
                          r[y].push({ [uid]: obj });
                        } else {
                          r[y].push(isObject(obj) ? { obj } : obj);
                        }
                      } else {
                        if (record[path.groupBy])
                          r[y][record[path.groupBy]] = obj;
                        else if (!record[path.groupBy]) {
                          r[y][uid] = obj;
                        } else {
                          r[y] = obj;
                        }
                      }
                    }
                  } else if (
                    subkeyIndex == path[key].split(".").length - 1 &&
                    o &&
                    typeof ((i && o[i]) || (!i && o)) == "object"
                  ) {
                    obj =
                      (isObject(o[i]) &&
                        ((path.copyAllFields && { ...o[i] }) || {})) ||
                      "";
                    Object.keys(path.fields).forEach((field, index) => {
                      if (field.split(".").length == 1) {
                        obj[field] =
                          !isBoolean(path.fields[field]) &&
                          !isNumber(path.fields[field])
                            ? (path.fields[field].toString().split(".").length >
                                1 &&
                                path.fields[field]
                                  .split(".")
                                  .reduce(
                                    (u, h) => u && u[h],
                                    (i && o[i]) || (!i && o)
                                  )) ||
                              ((i && o[i]) || (!i && o))[path.fields[field]] ||
                              (path.fields[field] == path.groupBy &&
                                path.isUUID &&
                                uid)
                            : path.fields[field];

                        if (obj[field] == undefined) delete obj[field];
                      } else {
                        field.split(".").reduce((e, f) => {
                          if (f == field.split(".").length - 1) {
                            var mappedValue =
                              !isBoolean(path.fields[field]) &&
                              !isNumber(path.fields[field])
                                ? (path.fields[field].toString().split(".")
                                    .length > 1 &&
                                    path.fields[field]
                                      .split(".")
                                      .reduce(
                                        (u, h) => u && u[h],
                                        (i && o[i]) || (!i && o)
                                      )) ||
                                  ((i && o[i]) || (!i && o))[
                                    path.fields[field]
                                  ] ||
                                  (path.fields[field] == path.groupBy &&
                                    path.isUUID &&
                                    uid)
                                : path.fields[field];

                            if (!f) {
                              e = mappedValue;
                            } else {
                              if (mappedValue == undefined) delete e[f];
                              else e[f] = mappedValue;
                            }
                          }
                          return e && ((f && e[f]) || (!f && e));
                        }, obj);
                      }
                    });

                    if (((i && o[i]) || (!i && o))[path.groupBy])
                      r[y][((i && o[i]) || (!i && o))[path.groupBy]] = obj;
                    else if (path.isUUID) {
                      r[y][uid] = obj;
                    } else r[y] = obj;
                  }
                  return (o && ((i && o[i]) || (!i && o))) || undefined;
                }, oldMain);
              }
              // else if (keyindex == key.split(".").length - 1 && r[y] == undefined || r[y] == null) {
              //   r[y] = {...oldMain};
              //   Object.keys(path.fields).forEach((field,index) => {
              //     r[y][field] = oldMain[path.fields[field]];
              //   });
              // }

              return r[y];
            }, newMain);
          });
      } else if (!path.groupBy && !path.fields && path.commentFields) {
        Object.keys(path)
          .filter(
            (key) =>
              key != "selectedIndex" &&
              key != "commentFields" &&
              key != "fields" &&
              key != "groupBy" &&
              key != "isUUID" &&
              key != "copyAllFields"
          )
          .forEach((key) => {
            key.split(".").reduce((r, y, keyindex) => {
              if (keyindex == key.split(".").length - 1) {
                newMain[key] = {};
                Object.keys(path.commentFields).map((fieldKey) => {
                  if (!newMain[key][fieldKey]) {
                    newMain[key][fieldKey] = [];
                  }
                  path[key].split(".").reduce((o, i, subkeyIndex) => {
                    Object.keys(o[i]).forEach((oldFieldkey) => {
                      if (
                        typeof path.commentFields[fieldKey] == "string" &&
                        oldFieldkey.indexOf(path.commentFields[fieldKey]) != -1
                      ) {
                        if (Array.isArray(o[i][oldFieldkey])) {
                          o[i][oldFieldkey].forEach((commentObj) => {
                            newMain[key][fieldKey].push(commentObj);
                          });
                        } else {
                          newMain[key][fieldKey].push(o[i][oldFieldkey]);
                        }
                        /* Test object */

                        // var vv = testCommentObj[0];
                        // newMain[key][fieldKey].push(vv);
                        // newMain[key][fieldKey].push(vv);
                      } else if (Array.isArray(path.commentFields[fieldKey])) {
                        path.commentFields[fieldKey].forEach((commentField) => {
                          if (oldFieldkey.indexOf(commentField) != -1) {
                            if (Array.isArray(o[i][oldFieldkey])) {
                              o[i][oldFieldkey].forEach((commentObj) => {
                                newMain[key][fieldKey].push(commentObj);
                              });
                            } else {
                              newMain[key][fieldKey].push(o[i][oldFieldkey]);
                            }
                            /* Test object */
                            // var ss = testCommentObj[0];
                            // newMain[key][fieldKey].push(ss);
                            // newMain[key][fieldKey].push(ss);
                          }
                        });
                      }
                    });
                    return (o && ((i && o[i]) || (!i && o))) || undefined;
                  }, oldMain);
                });
              }
              return r[y];
            }, newMain);
          });
      }
    }
  });

  return newMain;
};

export const resetMainObject = (mainObject) => {
  Object.keys(mainObject).forEach((key) => {
    //
    if (!isNumeric(key) && key != "user") {
      if (
        mainObject[key] &&
        !Array.isArray(mainObject[key]) &&
        typeof mainObject[key] == "object"
      ) {
        resetMainObject(mainObject[key]);
      } else if (mainObject[key]) {
        if (Array.isArray(mainObject[key])) mainObject[key] = [];
        else if (typeof mainObject[key] == "boolean") mainObject[key] = false;
        else if (typeof mainObject[key] == "number") mainObject[key] = 0;
        else if (typeof mainObject[key] == "string") mainObject[key] = "";
      }
    } else {
      delete mainObject[key];
    }
  });

  return mainObject;
};
