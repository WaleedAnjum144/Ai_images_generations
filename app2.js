const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const downloadBtn = document.querySelectorAll(".download-btn");

downloadBtn.forEach(button => {
    button.addEventListener("click", handleDownload)
});

function handleDownload(event){
    const imgCard = event.target.closest(".img-card");
    const imgElement = imgCard.querySelector("img");
    const imgUrl = imgElement.src;
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = "download_Image.jpeg";
    link.target = "_blank";
    link.click();

}

const OPENAI_API_KEY = "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";

// PLacing the images 

const  updateImagesCard = ImageDataArray  => {
    ImageDataArray.forEach((imgObject,index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card");
        const  imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn")


        // generated image 

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        // onload reamoving the loading 
        imgElement.onload = () =>{

            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href" , aiGeneratedImg);
            downloadBtn.setAttribute("download" , `${new Date().getTime()}.jpg `)

        };
        
    });

}

// generated ai images and calling apis for the openai images 

const generateAiImages  = async (userPrompt,userImgQuantity) => {

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", 
        {
            method: "POST",
            headers: {

                "Content-Type" : "application/json",
                Authentication : `Bearer ${OPENAI_API_KEY}`

            },
            body : JSON.stringify({
                prompt :userPrompt,
                n : parseInt(userImgQuantity),
                size : "512x512",
                format_json : "b64_json"


            })

        });

        if(!response.ok){
        throw new Error ("The generated images Request is not valid, Try again!")
        }
        const {data} = await response.json();
        updateImagesCard([...data]);
       
    } catch (error) {
        alert(error.message)
    }

}


function handleFormSubmission(e) {
  e.preventDefault();

  // getting the userInput and image quantity
  const userPrompt = e.target[0].value;
  const userImgQuantity = e.target[1].value;

//   this create the loading dic imge when the images is being loading 

  const imgCardMarkup = Array.from({ length: userImgQuantity }, () => 
    `   <div class="img-card loading ">
<img src="loader.svg" alt="image">
<a href="" class="download-btn" id="downBtn">
    <img src="download.svg" alt="download-icon">
</a>
</div>`
  ).join("");
 imageGallery.innerHTML = imgCardMarkup;

// console.log(imgCardMarkup)

generateAiImages(userPrompt,userImgQuantity);
  
}

generateForm.addEventListener("submit", handleFormSubmission);
