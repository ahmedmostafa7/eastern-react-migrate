import { postItem } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { host } from "imports/config";
import { concat } from "lodash";

export function postAllData(url, data, config) {
  return new Promise((resolve, reject) => {
    postItem(url, data, config).then((response) => {
      if (response.next) {
        (
          (config?.headers &&
            postAllData(response.next, data, { headers: config.headers })) ||
          postAllData(response.next, data)
        ).then((data) => {
          resolve(concat(...response.results, ...data));
        });
      } else {
        const dataReturned = response.results ? response.results : response;
        resolve(dataReturned);
      }
    });
  });
}
