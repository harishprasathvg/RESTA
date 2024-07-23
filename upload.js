if(!navigator.onLine){
    alert("You are Offline, You must have internet connection to View this page");
    location.href = "index.html";
}


import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, setDoc,doc} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

function uploadImage() {
  
    const username = "harish";

    if(document.getElementById('imageInput').files.length==0){
        alert("Error, choose the image first...");
    }
    else{
       
        const imageInput = document.getElementById('imageInput');
        const loading = document.getElementById('s1');
        const uploadStatus = document.getElementById('uploadStatus');
        
        const div1 = document.getElementById("div1");
        div1.style.filter="blur(3.8px)";
        loading.style.display='block';
        div1.style.pointerEvents="none";
        document.body.style.overflow = 'hidden';

        if (imageInput.files && imageInput.files[0]) {

            //uploading files to firebase
            const file = imageInput.files[0];
            const firebaseConfig = {
                //api key
            };
            
            const app = initializeApp(firebaseConfig);
            const storage = getStorage(app);
            const timestamp = Date.now();
            const currentDate = new Date(timestamp);
            const formattedDate = currentDate.toISOString().slice(0, 10); // Format: YYYY-MM-DD

            const filenameParts = file.name.split('.');
            const extension = filenameParts.pop(); 
            const filename = `${filenameParts.join('_')}_${timestamp}.${extension}`;

            const storageRef = ref(storage, `${username}/${filename}`);
        
            uploadBytes(storageRef, file).then((snapshot) => {})
            .catch((error)=>{
                console.error('Error uploading the image:', error);
            });

            //extracting data and add it to firestore
            let data = new FormData();
            data.append("document", file, file.name);
            
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
                            const quantity = item.quantity ? item.quantity : 1;
                            const price = item.unit_price ? item.unit_price : item.total_amount / quantity;
                            
                            const temp = {
                                id: index + 1,
                                item_name: item.description,
                                quantity: quantity,
                                price: price,
                                amount: item.total_amount
                            };
                            
                            line_items.push(temp);
                            no_of_products = index;
                        });
                        
                        
                        const userdb = {
                            
                                date:parsedJSON.document.inference.prediction.date ? parsedJSON.document.inference.prediction.date.value : formattedDate,
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
                        const customDocRef = doc(collectionRef, `${filename}`);
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
            xhr.setRequestHeader("Authorization", "api key"); // Replace with your Mindee API key
            xhr.send(data);
            
        }
        
    }
}
document.getElementById("uploadButton").addEventListener("click",uploadImage);


function displayImage(event) {


    const fileInput = event.target;
    const imageContainer = document.getElementById("Container");


    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const imgElement = document.createElement("img");
            imgElement.src = e.target.result;
            imgElement.style.maxHeight='500px';
            imgElement.style.maxWidth='500px';
            imageContainer.innerHTML = "";
            imageContainer.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    }

}
const imgInput = document.getElementById("imageInput");
imgInput.addEventListener("change", displayImage);
