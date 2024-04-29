import { get } from "lodash";
import moment from "moment-hijri";

export default {
    search_with: {
        name: "search_with",
        label: "search_with",
        field: "select",
        data: [
            // {value: 'file_no'},
            { key: "request_no", value: "request_no" },

        ],
        moduleName: "search_with",
        label_key: "key",
        value_key: "value",
    },
    search: {
        name: "search",
        label: "search value",
        // permission: {
        //     not_match_value: { search_with: "status" },
        // },
    },

    from_date: {
        name: "from_date",
        label: "from_date",
        field: "hijriDatePicker",
        dateFormat: "iYYYY/iMM/iDD",
        selectedDate: moment().format("iYYYY/iMM/iDD"),
        lessThanToday: true,
        lessThanDate: { key: "to_date", label: "الى تاريخ" },
    },
    to_date: {
        name: "to_date",
        label: "to_date",
        field: "hijriDatePicker",
        dateFormat: "iYYYY/iMM/iDD",
        selectedDate: moment().format("iYYYY/iMM/iDD"),
        lessThanToday: true,
        moreThanDate: { key: "from_date", label: "من تاريخ" },
    },
};
