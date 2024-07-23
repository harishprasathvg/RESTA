if(!navigator.onLine){
    
    alert("You are Offline, You must have internet connection to View this page");
    location.href = "index.html";
}

import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, setDoc,doc} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const username="harish";
       
       const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const capturedImage = document.getElementById('capturedImage');
        const captureBtn = document.getElementById('captureBtn');
        const upload = document.getElementById('upload');
        const recapture = document.getElementById('recapture');
        const switchcamera = document.getElementById('switchCamera');
        const captureanother = document.getElementById("captureanother");
        const retry = document.getElementById("retry");

        let currentCamera = 'environment';

        navigator.mediaDevices.getUserMedia({ video: { facingMode: currentCamera } })
            .then((stream) => {
                video.srcObject = stream;
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
            });
        

            function switchCamera() {

                if ('environment' == currentCamera) {
                    currentCamera = 'user';
                }
                else{
                    currentCamera = 'environment';
                }
                    navigator.mediaDevices.getUserMedia({ video: { facingMode: currentCamera } })
                        .then(stream => {
                            video.srcObject = stream;
                        })
                        .catch(error => {
                            console.error('Error switching camera:', error);
                        });
                
            }
            switchcamera.addEventListener("click",switchCamera)


        captureBtn.addEventListener('click', () => {
            video.style.display = 'none';
            upload.style.display = 'block';
            captureBtn.style.display = 'none';
            recapture.style.display = 'block';
            switchcamera.style.display = 'none';
            captureanother.style.display="none";
            retry.style.display="none";

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageDataURL = canvas.toDataURL('image/png');
            capturedImage.src = imageDataURL;
            capturedImage.style.display = 'block';
        });
    

        function uploadImage() {
            const loading = document.getElementById('s1');
            const uploadStatus = document.getElementById('uploadStatus');
            const div1 = document.getElementById("div1");
            div1.style.filter="blur(3.8px)";
            loading.style.display = 'block';
            div1.style.pointerEvents="none";
            document.body.style.overflow = 'hidden';

            const firebaseConfig = {
               //apikey
            };
            
            const app = initializeApp(firebaseConfig);
            const storage = getStorage(app);
            const filename =  username+`-${Date.now()}.png`;
            const storageRef = ref(storage, username+"/"+filename);

            canvas.toBlob((blob) => {
                uploadBytes(storageRef, blob)
                  .then((snapshot) => {

                        //extracting data and add it to firestore
                        let data = new FormData();
                        
                        data.append("document", blob,filename);
                        
                        let xhr = new XMLHttpRequest();
                        
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                if (xhr.status === 201) { 
                                    
                                    const parsedJSON = JSON.parse(xhr.responseText);
                                    if (parsedJSON.document) {
                                    const lineItems = parsedJSON.document.inference.prediction.line_items;
                                    const line_items = [];
                                    var no_of_products=0;
                                    lineItems.forEach((item, index) => {
                                        const temp ={
                                            id:index + 1,
                                            item_name:item.description,
                                            quantity:item.quantity,
                                            price:item.unit_price,
                                            amount:item.total_amount,
                                        };
                                        line_items.push(temp);
                                        no_of_products=index;
                                    });
                                    
                                    const userdb = {
                                        
                                            date:parsedJSON.document.inference.prediction.date.value,
                                            category:parsedJSON.document.inference.prediction.category.value,
                                            supplier_name:parsedJSON.document.inference.prediction.supplier_name.value,
                                            supplier_address:parsedJSON.document.inference.prediction.supplier_address.value,
                                            total_amount:parsedJSON.document.inference.prediction.total_amount.value,
                                            tax:parsedJSON.document.inference.prediction.total_tax.value,
                                            time:parsedJSON.document.inference.prediction.time.value,
                                            items:line_items,
                                            total_products:no_of_products,
                                        
                                    }

                                    const db = getFirestore(app);
                                    const collectionRef = collection(db, username);
                                    const customDocRef = doc(collectionRef, filename);
                                    setDoc(customDocRef, userdb)
                                        .then((docRef) => {
                                            uploadStatus.textContent = 'Image uploaded successfully!';
                                            loading.style.display='none';
                                            div1.style.filter="blur(0)";
                                            div1.style.pointerEvents="auto";
                                            document.body.style.overflow = 'auto';
                                        })
                                        .catch((error) => {
                                            console.error('Error adding document:', error);
                                            uploadStatus.textContent = 'Image upload failed.';
                                            loading.style.display='none';
                                            div1.style.filter="blur(0)";
                                            div1.style.pointerEvents="auto";
                                            document.body.style.overflow = 'auto';
                                        });
                                    
                                } else {
                                    console.log("No line items found in the JSON file.");
                                }
                                } else {
                                    console.error('Error:', xhr.status, xhr.statusText);
                                    
                                }
                            }
                        };
                        
                        xhr.open("POST", "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict");
                        xhr.setRequestHeader("Authorization", "api key for mindee"); // Replace with your Mindee API key
                        xhr.send(data);

                    
                  })
                  .catch((error) => {
                    loading.style.display = 'none';
                    div1.style.filter="blur(0)";
                    div1.style.pointerEvents="auto";
                    document.body.style.overflow = 'auto';
                    console.error('Error uploading the image:', error);
                    uploadStatus.textContent = "image upload failed!"
                    retry.style.display="block";
                    upload.style.display="none";
                    recapture.style.display="none";
                  });
              }, 'image/png');
        }
        upload.addEventListener("click",uploadImage);

        function reCapture(){
            video.style.display = 'block';
            upload.style.display = 'none';
            captureBtn.style.display = 'block';
            recapture.style.display = 'none';
            capturedImage.style.display='none';
            uploadStatus.style.display='none';
            switchcamera.style.display = 'block';
        }
        recapture.addEventListener("click",reCapture);

        function Retry(){
            retry.style.display="none";
            uploadImage();
        }
        retry.addEventListener("click",Retry);

        function captureAnother(){
            captureanother.style.display="none";
            reCapture();
        }
        captureanother.addEventListener("click",captureAnother);