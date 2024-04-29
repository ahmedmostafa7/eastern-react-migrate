import { fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { get } from "lodash";
import { fetchAllData } from "app/helpers/functions";

export function getPaginatedData(props, onMount) {
  const {
    t,
    crud: { fetch },
    setItemsCount,
    addToData,
    api_config,
    setTotalPages,
    pagination = {},
    pageSize: propsPageSize,
    initialPage = 1,
  } = props;
  const { pageSize = propsPageSize, currentPage = 1 } = pagination;
  const shift = initialPage - 1;
  fetchData(fetch, {
    ...api_config,
    params: {
      ...get(api_config, "params"),
      pageSize,
      page: currentPage + shift,
    },
  }).then(
    ({ results, totalPages, count }) => {
      setTotalPages(totalPages);
      addToData(results, (currentPage - 1) * pageSize, "rewrite");
      setItemsCount(count);
      this.loading = false;
      // if (onMount) {
      //     fetchData(fetch, {
      //         ...api_config,
      //         params: {
      //             ...get(api_config, 'params'),
      //             size: pageSize,
      //             page: totalPages
      //         }
      //     })
      //         .then(({ results }) => {
      //             setItemsCount((totalPages - 1) * pageSize + results.length);
      //         })
      // }
    },
    (err) => handleErrorMessages(err, t)
  );
}

export function getScrollingData(props, onMount) {
  const {
    t,
    crud: { fetch },
    addToData,
    setData,
    api_config,
    setNextUrl,
    links = {},
    pageSize,
  } = props;
  const { nextLink } = links;
  if (onMount) {
    fetchData(fetch, {
      ...api_config,
      params: {
        ...get(api_config, "params"),
        pageSize,
      },
    }).then(
      ({ results, next }) => {
        setData(results);
        setNextUrl(next);
        this.loading = false;
      },
      (err) => handleErrorMessages(err, t)
    );
  } else {
    fetchData(nextLink, api_config).then(
      ({ results, next }) => {
        addToData(results, -1);
        setNextUrl(next);
        this.loading = false;
      },
      (err) => handleErrorMessages(err, t)
    );
  }
}

export function getAllData(props) {
  const {
    crud: { fetch },
    api_config,
    setData,
    t,
  } = props;
  fetchAllData(fetch, api_config).then(
    (data) => {
      setData(data);
      this.loading = false;
    },
    (err) => handleErrorMessages(err, t)
  );
}
