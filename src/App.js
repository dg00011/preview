import { useState } from "react";
import "./App.css";
//import EXIF from "exif-js";

function App() {
  const [src, setsrc] = useState();

  const displayIMG = (event) => {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      setsrc(url);

      uploadFileToThreeKit(event.target.files[0])

      console.log("show", URL.createObjectURL(event.target.files[0]));
    }
  };


 

  const authToken = 'e2be7601-d925-4ee0-a270-be355652264d'; //Canvas Prints Sandbox localhost
 // const assetId = '73e203fa-0d97-4d92-94b3-6da57f708b73';
 const orgID = '00c181f6-4e03-411a-87fa-18a10b9f3ddb'; //Canvas Prints Sandbox
  


  
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

   console.log(jobIdGlobal)
   getAssetIDfromJob(jobIdGlobal)
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
    console.log(job_status, imageassetId, imagefileId)

    document.getElementById('assetId').innerHTML="https://preview.threekit.com/o/canvasprintssandbox/assets/"+imageassetId;
    document.getElementById('assetId').setAttribute('href',"https://preview.threekit.com/o/canvasprintssandbox/assets/"+imageassetId)

  return { job_status, imageassetId, imagefileId };
}








  return (
    <div className="App">
      <input
        type="file"
        accept=".png , .jpg , .jpeg"
        name="pic"
        id="pic"
        onChange={(e) => displayIMG(e)}
      />

      <img src={src} alt="..." className="pic" />




<a href="" id="assetId"></a>

    </div>
  );
}

export default App;
