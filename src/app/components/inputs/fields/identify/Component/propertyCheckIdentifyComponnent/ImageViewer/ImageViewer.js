import React from "react";
import { Image } from "antd";
function ImageViewer(props) {
  return (
    <>
    <h2 className="text-center">
            {props.title}
        </h2>
        
    <div>
      <Image.PreviewGroup
        preview={{
          onChange: (current, prev) =>
            console.log(`current index: ${current}, prev index: ${prev}`),
        }}
      >
        <div style={{display:'flex', flexWrap:'wrap'}}>
        {props?.galleryData?.length
          ? props?.galleryData?.map(
              (item, idx) => (
                <div key={"gArch"+idx} style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                <Image
                  width={200}
                  src={
                    window.archiveGalleryPrefixUrl +
                    item.Path.replaceAll("\\", "/")
                  }
                  alt={item.Name}
                />
                <span className="text-center">
                  {item.Name}
                </span>
              </div>
              )
              
              )
              : "لا توجد صور للعرض"}
              </div>
      </Image.PreviewGroup>
    </div>
    </>

  );
}

export default ImageViewer;
