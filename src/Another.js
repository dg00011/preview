import React from "react";
import { piexif } from "piexifjs";

const Another = () => {
  // function postJpeg (binStr) {
  //     var array = [];
  //     for (var p=0; p<data.length; p++) {
  //         array[p] = data.charCodeAt(p);
  //     }
  //     var u8array = new Uint8Array(array);

  //     var req = new XMLHttpRequest();
  //     req.open("POST", "/jpeg", false);
  //     req.setRequestHeader('Content-Type', 'image/jpeg');
  //     req.send(u8array.buffer);
  // }

  function previewJpeg(evt) {
    var files = evt.target.files;
    var previewDiv = document.getElementById("preview");
    console.log(previewDiv);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (!file.type.match("image/jpeg.*")) {
        continue;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        var exif = piexif.load(e.target.result);

        console.log(exif)
        var image = new Image();
        image.onload = function () {
           var orientation = exif["0th"][piexif.ImageIFD?.Orientation];
        //var orientation = 6;
            console.log(orientation);
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          var ctx = canvas.getContext("2d");
          var x = 0;
          var y = 0;
          ctx.save();
          if (orientation === 2) {
            x = -canvas.width;
            ctx.scale(-1, 1);
          } else if (orientation === 3) {
            x = -canvas.width;
            y = -canvas.height;
            ctx.scale(-1, -1);
          } else if (orientation === 4) {
            y = -canvas.height;
            ctx.scale(1, -1);
          } else if (orientation === 5) {
            canvas.width = image.height;
            canvas.height = image.width;
            ctx.translate(canvas.width, canvas.height / canvas.width);
            ctx.rotate(Math.PI / 2);
            y = -canvas.width;
            ctx.scale(1, -1);
          } else if (orientation === 6) {
            canvas.width = image.height;
            canvas.height = image.width;
            ctx.translate(canvas.width, canvas.height / canvas.width);
            console.log(canvas.width, canvas.height / canvas.width,Math.PI / 2)
//ctx.rotate(Math.PI / 2);
          } else if (orientation === 7) {
            canvas.width = image.height;
            canvas.height = image.width;
            ctx.translate(canvas.width, canvas.height / canvas.width);
            ctx.rotate(Math.PI / 2);
            x = -canvas.height;
            ctx.scale(-1, 1);
          } else if (orientation === 8) {
            canvas.width = image.height;
            canvas.height = image.width;
            ctx.translate(canvas.width, canvas.height / canvas.width);
            ctx.rotate(Math.PI / 2);
            x = -canvas.height;
            y = -canvas.width;
            ctx.scale(-1, -1);
          }
          ctx.drawImage(image, x, y);
          ctx.restore();

         // var dataURL = canvas.toDataURL("image/jpeg", 1.0);
          //var jpegBinary = atob(dataURL.split(",")[1]);

          // restore exif(remove orientation value)
          //                if (typeof orientation !== "undefined") {
          //                    delete exif["0th"]["Orientation"];
          //                }
          //                var exifbytes = piexif.dump(exif);
          //                jpegBinary = piexif.insert(exifbytes, jpegBinary);

          var div = document.getElementById("div");
          div.append(canvas);
          const link = canvas.toDataURL();
        //   console.log(link);

          //uploadFileToThreeKit(link);
          base64ToFile(link);

          // var button = $("<button>post this image</button>");
          // button.click(function () {
          //     //postJpeg(jpegBinary);
          //     console.log("post jpeg");
          // });

          previewDiv?.prepend(div);
        };
        image.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

//   const displayIMG = (event) => {
//     if (event.target.files && event.target.files[0]) {
//       const url = URL.createObjectURL(event.target.files[0]);
//       // setsrc(url);
//       console.log(event.target.files[0]);
//       //uploadFileToThreeKit(event.target.files[0])

//       console.log("show", URL.createObjectURL(event.target.files[0]));
//     }
//   }; 

  // Getting Blob from base64 then converting it to file
  async function base64ToFile(base64Img) {
    let imgBlob = await fetch(base64Img)
      .then((res) => res.blob())
      .then((res) => {
        return res;
      });
    const imgFile = new File([imgBlob], "thumbnail.png");
    console.log(imgFile);
    uploadFileToThreeKit(imgFile);
    return imgFile;
  }



  const authToken = "b11be148-7ab1-4442-8738-d6f3f56c0b88"; //Canvas Prints Sandbox localhost
  // const assetId = '73e203fa-0d97-4d92-94b3-6da57f708b73';
  const orgID = "00c181f6-4e03-411a-87fa-18a10b9f3ddb"; //Canvas Prints Sandbox

  //upload file to 3Kit CDN
  async function uploadFileToThreeKit(filedata) {
    var myHeaders = new Headers(); //post
    var jobIdGlobal;
    var formdata = new FormData();
    formdata.append("orgId", orgID);
    formdata.append("files", filedata);
    formdata.append("sync", true);

    var requestOptionsUpload = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    await fetch(
      "https://preview.threekit.com/api/catalog/assets/upload?bearer_token=" +
        authToken,
      requestOptionsUpload
    )
      .then((response) => response.json())
      .then(
        (result) => {
          //
          jobIdGlobal = result[0].jobId;
        } //end of then result
      )

      .catch((error) => console.log("error", error));

    console.log(jobIdGlobal);
    getAssetIDfromJob(jobIdGlobal);
    return jobIdGlobal;
  }

  //This function will return fileID and assetId.
  async function getAssetIDfromJob(jobID) {
    var myHeadersAsset = new Headers(); //get
    var imageassetId;
    var imagefileId;
    var job_status;
    var requestOptionsAsset = {
      method: "GET",
      headers: myHeadersAsset,
      redirect: "follow",
    };
    await fetch(
      "https://preview.threekit.com/api/catalog/jobs/" +
        jobID +
        "?bearer_token=" +
        authToken +
        "&orgId" +
        orgID,
      requestOptionsAsset
    )
      .then((responseAsset) => responseAsset.json())
      .then(
        (resultAsset) => {
          job_status = resultAsset.job.status;
          if (job_status === "stopped") {
            imageassetId = resultAsset?.output?.texture[0]?.assetId;
            imagefileId = resultAsset?.job?.parameters?.files[0]?.fileId;
          }
        } //end then resultAsset
      ) //end then resultAsset
      .catch((error) => console.log("error", error));
    console.log(job_status, imageassetId, imagefileId);

    //document.getElementById('assetId').innerHTML="https://preview.threekit.com/o/canvasprintssandbox/assets/"+imageassetId;
    document
      .getElementById("assetId")
      .setAttribute(
        "href",
        "https://preview.threekit.com/o/canvasprintssandbox/assets/" +
          imageassetId
      );

    return { job_status, imageassetId, imagefileId };
  }

  return (
    <>
      <div>
        JPEG FILES ONLY
        <br />
        You can choose multiple files
        <br />
        <input
          type="file"
          id="files"
          name="files[]"
          multiple
          onChange={(e) => previewJpeg(e)}
        />
        <br />
      </div>
      <div id="preview"></div>
      <div id="div"></div>

      <a href="https://google.com" id="assetId">
        go to the link
      </a>
    </>
  );
};

export default Another;
