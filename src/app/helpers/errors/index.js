export const handleErrorMessages = (err, t) => {
  if (err.response) {
    switch (+err.response.status) {
      case 401:
        // $state.go('split_merge_login');
        // $injector.get('$rootScope').notifySystem("error", "login.UNACTIVEMSG", 5000);
        break;
      case 204:
      case 404:
        window.notifySystem("error", t("messags:global.NoContent"));
        break;
      case 403:
        window.notifySystem("error", t("messags:global.forbidden"));
        break;
      case 409:
        window.notifySystem("error", t("messags:global.ownerExists"));
        break;
      case 410:
        window.notifySystem("error", "برجاء التواصل مع الدعم الفني");
        break;
      case 333:
        //console.info('server internal error: ' + response.data);
        window.notifySystem(
          "error",
          "الكاد غير مطابق للمواصفات يرجى التواصل مع الدعم الفني"
        );
        break;
      case 500:
        //console.info('server internal error: ' + response.data);
        window.notifySystem("error", t("global.INTERNALSERVERERROR"));
        break;
      default:
        window.notifySystem(
          "error",
          t(
            `messages:${
              (err && typeof err.response == "string" && err.response) ||
              (err &&
                err.response &&
                typeof err.response.data == "string" &&
                err.response.data) ||
              (err &&
                err.response &&
                err.response.data &&
                typeof err.response.data.msg == "string" &&
                (err.response.data.Error || err.response.data.msg))
            }` || "Failed to update"
          )
        );
        break;
    }
  } else if (err.msg && typeof err.msg == "string") {
    window.notifySystem(
      "error",
      t(`messages:` + (`${err.Error || err.msg}` || "Failed to update"))
    );
  } else {
    window.notifySystem("error", t("Failed to update"));
  }
};

export const checkAppMainLayers = (props, data, isMsa7y = true) => {
  let isValid = true;
  switch (props.currentModule.app_id || props.currentModule.record.app_id) {
    case 1:
      if (
        !Object.keys(data).find((layerKey) => layerKey == "shapeFeatures")
          .length ||
        (Object.keys(data).find((layerKey) => layerKey == "shapeFeatures")
          .length &&
          data.shapeFeatures.find((polygon) => polygon.layer == "boundry") ==
            undefined)
      ) {
        window.notifySystem("error", "boundry من فضلك تأكد من وجود طبقة");
        isValid = false;
      }

      if (
        Object.keys(data).find((layerKey) => layerKey == "shapeFeatures")
          .length &&
        !data?.shapeFeatures?.length
      ) {
        window.notifySystem(
          "error",
          "boundry من فضلك تأكد من ملف الرفع المساحي لأنه لا يحتوي على رسم مضلعات مغلقة لطبقة"
        );
        isValid = false;
      }

      break;
    case 8:
    case 14:
      if (
        !Object.keys(data).find((layerKey) => layerKey == "details").length ||
        (Object.keys(data).find((layerKey) => layerKey == "details").length &&
          !data?.details?.length)
      ) {
        
        window.notifySystem(
          "error",
          "وبياناتها details من فضلك تأكد من وجود طبقة"
        );
        isValid = false;
      }

      if (
        Object.keys(data).find((layerKey) => layerKey == "shapeFeatures") ==
        undefined
      ) {
        window.notifySystem("error", "boundry من فضلك تأكد من وجود طبقة");
        isValid = false;
      }

      if (
        Object.keys(data).find((layerKey) => layerKey == "shapeFeatures") !=
          undefined &&
        !data?.shapeFeatures?.length
      ) {
        window.notifySystem(
          "error",
          "boundry من فضلك تأكد من ملف الرفع المساحي لأنه لا يحتوي على رسم مضلعات مغلقة لطبقة"
        );
        isValid = false;
      }

      if (
        Object.keys(data).find((layerKey) => layerKey == "shapeFeatures") !=
          undefined &&
        data?.shapeFeatures?.length > 1 &&
        data?.shapeFeatures.find((parcel) => parcel.isFullBoundry == true) ==
          undefined
      ) {
        window.notifySystem(
          "error",
          "في ملف الرفع المساحي full_boundry من فضلك تأكد من اسم طبقة"
        );
        isValid = false;
      }

      break;

    case 16:
      if (isMsa7y) {
        if (
          Object.keys(data).find((layerKey) => layerKey == "shapeFeatures") ==
          undefined
        ) {
          window.notifySystem("error", "boundry من فضلك تأكد من وجود طبقة");
          isValid = false;
        }

        if (
          Object.keys(data).find((layerKey) => layerKey == "shapeFeatures") !=
            undefined &&
          !data?.shapeFeatures?.length
        ) {
          window.notifySystem(
            "error",
            "boundry من فضلك تأكد من ملف الرفع المساحي لأنه لا يحتوي على رسم مضلعات مغلقة لطبقة"
          );
          isValid = false;
        }
      } else {
        if (!data?.shapeFeatures?.boundry) {
          window.notifySystem("error", "boundry من فضلك تأكد من وجود طبقة");
          isValid = false;
        }

        if (
          data?.shapeFeatures?.boundry &&
          !data?.shapeFeatures?.boundry?.length
        ) {
          window.notifySystem(
            "error",
            "boundry من فضلك تأكد من ملف الرفع المساحي لأنه لا يحتوي على رسم مضلعات مغلقة لطبقة"
          );
          isValid = false;
        }

        if (!data?.shapeFeatures?.landbase) {
          window.notifySystem("error", "landbase من فضلك تأكد من وجود طبقة");
          isValid = false;
        }

        if (
          data?.shapeFeatures?.landbase &&
          !data?.shapeFeatures?.landbase?.length
        ) {
          window.notifySystem(
            "error",
            "landbase من فضلك تأكد من ملف الرفع المساحي لأنه لا يحتوي على رسم مضلعات مغلقة لطبقة"
          );
          isValid = false;
        }
      }

      break;
  }

  return isValid;
};
