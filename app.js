const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const downloadBtn = document.querySelectorAll(".download-btn");
// Add event listner

downloadBtn.forEach(button => {
  button.addEventListener("click", handleDownload);
});

function handleDownload(event) {
  const imgCard = event.target.closest(".img-card");
  const imgElement = imgCard.querySelector("img");
  const imgUrl = imgElement.src;
  const link = document.createElement("a");
  link.href = imgUrl;
  link.download = "download_image.jpg";
  link.target = "_blank";
  link.click();
}



const OPENAI_API_KEY = "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";

// Displayinh the ai generated images to our gallary 

const updateImagesCard = imgDataArray => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    
    const  downloadBtn = imgCard.querySelector(".download-btn")

    // Set the images source to the AI-generated image data

    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImg;

    // When the img is loaded, remove the loading class and set download btn
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href" , aiGeneratedImg);
      downloadBtn.setAttribute("download" , `${new Date().getTime()}.jpg`)
    };
  });
};

// Function Through Arrow function image generating
// Sending a request to OpenAi to gneerate images based on user inputs

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImgQuantity),
          size: "512x512",
          response_format: "b64_json"
        })
      }
    );
    if (!response.ok)
      throw new Error("Failed to generate the images! Please try again.");

    const { data } = await response.json(); //get date from the response
    updateImagesCard([...data]);
    
  } catch (error) {
    alert(error.message);
  }
};

// handleFormSubmission function

function handleFormSubmission(e) {
  e.preventDefault();

  // get the user input and image quantity values from the form
  const userPrompt = e.target[0].value;
  const userImgQuantity = e.target[1].value;

  // Creating HTML markup for the image cards with loading State

  const imgCardMarkup = Array.from(
    { length: userImgQuantity },
    () =>
      `  <div class="img-card loading">
        <img src="loader.svg" alt="image1">
        <a href="" class="download-btn">
            <img src="download.svg" alt="download-icon">
        </a>
    </div>`
  ).join("");
  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);












// 2nd Method For calling function and eventListener **********************







// generateForm.addEventListener(
//   "submit",
//   (handleFormSubmission = e => {
//     e.preventDefault();

//     // get the user input and image quantity values from the form
//     const userPrompt = e.target[0].value;
//     const userImgQuantity = e.target[1].value;

//     // Creating HTML markup for the image cards with loading State

//     const imgCardMarkup = Array.from(
//       { length: userImgQuantity },
//       () =>
//         ` <div class="img-card loading">
//     <img src="loader.svg" alt="image">
//     <a href="" class="download-btn">
//         <img src="download.svg" alt="download-icon">
//     </a>
// </div>`
//     ).join("");
//     imageGallery.innerHTML = imgCardMarkup;
//   })
// );
