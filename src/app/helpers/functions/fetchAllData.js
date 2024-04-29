import { fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { host } from "imports/config";
import { concat } from "lodash";

export function fetchAllData(url, config) {
  return new Promise((resolve, reject) => {
    fetchData(url, config).then((response) => {
      if (response.next) {
        fetchAllData(
          (response.next.indexOf(host.split("/")[host.split("/").length - 1]) !=
            -1 &&
            response.next) ||
            (response.next &&
              host
                .toLowerCase()
                .indexOf(response.next.toLowerCase().split("/")[1]) == -1 &&
              host + response.next) ||
            response.next
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
