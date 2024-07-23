if(!navigator.onLine){
    alert("You are Offline, You must have internet connection to View this page");
    location.href = "index.html";
}
const username = 'harish';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getStorage,ref ,getDownloadURL , listAll , deleteObject,getMetadata} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { getFirestore, collection,doc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
  //api key
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const folderRef = ref(storage, username);

const loading = document.getElementById('s1');
const div1 = document.getElementById("div1");
div1.style.filter = "blur(3.8px)";
div1.style.pointerEvents="none";
loading.style.display='block';
document.body.style.overflow = 'hidden';
const imageContainer = document.getElementById("imageContainer");


let array = [];
let temp = [];
let count;
function view(start_date,end_date){

    temp=[];
    count=0;
    imageContainer.innerHTML="";
    if(start_date===null && end_date===null){
        temp=array;
    }
    else{
        array.forEach((div) => {
            const date = new Date(div.getAttribute("name"));
            if ( (date > start_date && date < end_date) || isall===1)
            {
                count+=1;
                temp.push(div);
            }
        });
    }
    
    
    function displayImages(startIndex, endIndex) {
        imageContainer.innerHTML = '';
        for (let i = startIndex; i < endIndex; i++) {
            if (i < temp.length) {
                imageContainer.appendChild(temp[i]);
            }
        }
        previousButton.disabled = startIndex === 0;
        nextButton.disabled = endIndex >= temp.length;
    }
    
    
    const itemsPerPage = 15; 
    let currentPage = 0;

   
    function nextPage() {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = Math.min((currentPage + 1) * itemsPerPage, temp.length);
        displayImages(startIndex, endIndex);
        currentPage++;
    }

    function previousPage() {
        currentPage = Math.max(currentPage - 1, 0);
        const startIndex = currentPage * itemsPerPage;
        const endIndex = Math.min((currentPage + 1) * itemsPerPage, temp.length);
        displayImages(startIndex, endIndex);
    }

    nextButton.addEventListener('click', nextPage);

    previousButton.addEventListener('click', previousPage);
    
        nextPage();
    
}


listAll(folderRef)
    .then((result) => {
        const promises = result.items.map((item) => {
            return getDownloadURL(item)
                .then((url) => {
                    return getMetadata(item)
                        .then((metadata) => {
                            const itemDate = new Date(metadata.timeCreated);
                            const div = document.createElement("div");
                            div.id = "jsdiv";
                            const imgElement = document.createElement('img');
                            imgElement.src = url;
                            imgElement.style.maxHeight = '500px';
                            imgElement.style.maxWidth = '500px';

                            const imageKey = document.createElement('h4');
                            imageKey.textContent = item.name;
                            imageKey.style.marginTop = "50px";
                            const imageDate = document.createElement("h5");
                            
                            const splitData = itemDate.toString().split(" ");
                            imageDate.textContent= "DATE : "+splitData.slice(0,4).join(" ") +"\n"+ "TIME : "+ splitData.slice(4,5).join(" ") + " (IST)";
                    
                            div.appendChild(imageKey);
                            div.appendChild(imgElement);

                            const button = document.createElement('button');
                            button.textContent = "Delete";
                            button.className = "deletebtn";
                            button.addEventListener("click", () => {
                                
                                div1.style.filter = "blur(3.8px)";
                                loading.style.display = 'block';
                                div1.style.pointerEvents="none";
                                document.body.style.overflow = 'hidden';
                                
                                //delete image from firebase
                                const filename = username + "/" + item.name;
                                const delref = ref(storage, filename);
                                deleteObject(delref)
                                    .then(() => {
                                        imageContainer.removeChild(div);
                                        showSnackbar(item.name + " deleted !!! ");
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                    })
                                    

                                //delete data from firestone
                                const db = getFirestore(app);
                                const collectionRef = collection(db, username); 

                                const documentId = item.name; 
                                const documentRef = doc(collectionRef, documentId);
                                deleteDoc(documentRef)
                                    .then(() => {
                                        console.log('Document successfully deleted!');
                                    })
                                    .catch((error) => {
                                        console.error('Error removing document: ', error);
                                    });
                                    div1.style.filter = "blur(0)";
                                    loading.style.display = 'none';
                                    div1.style.pointerEvents="auto";
                                    document.body.style.overflow = 'auto';
                                    
                            });
                            div.appendChild(imageDate);
                            div.appendChild(button);
                            div.setAttribute("name", itemDate);
                            array.push(div);

                        });
                });
        });
        return Promise.all(promises);
    })
    .then(() => {
        view(null,null);
    })
    .catch((error) => {
        console.error("Error listing files:", error);
    });
    


div1.style.filter = "blur(0)";
loading.style.display='none';
div1.style.pointerEvents="auto";
document.body.style.overflow = 'auto';

const range = document.getElementById("range");
const custom = document.getElementById("custom");
const between = document.getElementById("between");
const div_range = document.getElementById("div_range");
const div_custom = document.getElementById("div_custom");
const div_between = document.getElementById("div_between");

range.addEventListener('change', () => {
    div_range.style.display="block";
    div_custom.style.display="none";
    div_between.style.display="none";
    selectDateRange();
});

custom.addEventListener('change', () => {
    div_range.style.display="none";
    div_custom.style.display="block";
    div_between.style.display="none";
    selectDateCustom();
});

between.addEventListener('change', () => {
    div_range.style.display="none";
    div_custom.style.display="none";
    div_between.style.display="block";
    selectDateBetween();
});

var start_date;
var end_date;
var isall;

function selectDateRange() {
    isall=0;
    const dateRange = document.getElementById("dateRange");
    const selectedOption = dateRange.options[dateRange.selectedIndex].value;
    var flag = 1;
    switch (selectedOption) {
        case "today":
                const today = new Date();
                start_date = new Date(today);
                start_date.setDate(today.getDate());
                end_date = new Date(today);
                end_date.setDate(end_date.getDate() + 1);
                break;
            case "yesterday":
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                start_date = new Date(yesterday);
                end_date = new Date(yesterday);
                end_date.setDate(end_date.getDate() + 1);
                break;
            case "lastWeek":
                const lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);
                start_date = new Date(lastWeek);
                end_date = new Date();
                end_date.setDate(end_date.getDate() + 1); 
                break;
            case "lastMonth":
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                start_date = new Date(lastMonth);
                end_date = new Date();
                end_date.setDate(end_date.getDate() + 1); 
                break;
            case "lastYear":
                const lastYear = new Date();
                lastYear.setFullYear(lastYear.getFullYear() - 1);
                start_date = new Date(lastYear);
                end_date = new Date();
                end_date.setDate(end_date.getDate() + 1); 
                break;
            case "all":
                isall=1;
                start_date = null;
                end_date = null; 
                break;

    }
    if(isall ===0){
        start_date=format_date(start_date);
        end_date=format_date(end_date);
    }
        view(start_date, end_date);
         
}
document.getElementById("dateRange").addEventListener("change",selectDateRange);


function format_date(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const new_date = new Date(year, month - 1, day);
    return new_date;
}

const custom_date = document.getElementById("custom_date");
const custom_month = document.getElementById("custom_month");
const custom_year = document.getElementById("custom_year");

function selectDateCustom() {
    isall=0;
    const dateCustom = document.getElementById("dateCustom");
    const selectedOption = dateCustom.options[dateCustom.selectedIndex].value;
    switch (selectedOption) {
            case "all":
                isall=1;
                start_date = null;
                end_date = null; 
                custom_date.style.display="none";
                custom_month.style.display="none";
                custom_year.style.display="none";
                break;
            case "date":
                start_date = document.getElementById("customDate").value;
                start_date = new Date(start_date);
                end_date = new Date(start_date);
                end_date.setDate(start_date.getDate()+1);
                custom_date.style.display="block";
                custom_month.style.display="none";
                custom_year.style.display="none";
                break;
            case "month":
                start_date = document.getElementById("customMonth").value;
                start_date = new Date(start_date);
                end_date = new Date(start_date);
                end_date.setMonth(start_date.getMonth()+1);
                custom_date.style.display="none";
                custom_month.style.display="block";
                custom_year.style.display="none";
                break;
            case "year":
                start_date = document.getElementById("customYear").value;
                start_date = new Date(start_date);
                end_date = new Date(start_date);
                end_date.setFullYear(start_date.getFullYear()+1);
                custom_date.style.display="none";
                custom_month.style.display="none";
                custom_year.style.display="block";
                break;
    }
    if(isall ===0){
        start_date=format_date(start_date);
        end_date=format_date(end_date);
    }
    view(start_date, end_date);  
}
document.getElementById("dateCustom").addEventListener("change",selectDateCustom);

function selectcustomDate(){
    start_date = document.getElementById("customDate").value;
    start_date = new Date(start_date);
    end_date = new Date(start_date);
    end_date.setDate(start_date.getDate()+1);
    start_date=format_date(start_date);
    end_date=format_date(end_date);
    view(start_date, end_date); 
}
document.getElementById("customDate").addEventListener("change",selectcustomDate);

function selectcustomMonth(){
    start_date = document.getElementById("customMonth").value;
    start_date = new Date(start_date);
    end_date = new Date(start_date);
    end_date.setMonth(start_date.getMonth()+1);
    start_date=format_date(start_date);
    end_date=format_date(end_date);
    view(start_date, end_date); 
}
document.getElementById("customMonth").addEventListener("change",selectcustomMonth);

function selectcustomYear(){
    start_date = document.getElementById("customYear").value;
    start_date = new Date(start_date);
    end_date = new Date(start_date);
    end_date.setFullYear(start_date.getFullYear()+1);
    start_date=format_date(start_date);
    end_date=format_date(end_date);
    view(start_date, end_date); 
}
document.getElementById("customYear").addEventListener("change",selectcustomYear);

const between_date = document.getElementById("between_date");
const between_month = document.getElementById("between_month");
const between_year = document.getElementById("between_year");

function selectDateBetween() {
    isall=0;
    const dateBetween = document.getElementById("dateBetween");
    const selectedOption = dateBetween.options[dateBetween.selectedIndex].value;
    switch (selectedOption) {
            case "all":
                isall=1;
                start_date = null;
                end_date = null; 
                between_date.style.display="none";
                between_month.style.display="none";
                between_year.style.display="none";
                break;
            case "date":
                start_date = document.getElementById("startDate").value;
                start_date = new Date(start_date);
                end_date = document.getElementById("endDate").value;
                end_date = new Date(end_date);
                end_date.setDate(end_date.getDate()+1);
                between_date.style.display="block";
                between_month.style.display="none";
                between_year.style.display="none";
                break;
            case "month":
                start_date = document.getElementById("startMonth").value;
                start_date = new Date(start_date);
                end_date = document.getElementById("endMonth").value;
                end_date = new Date(end_date);
                end_date.setMonth(end_date.getMonth()+1);
                between_date.style.display="none";
                between_month.style.display="block";
                between_year.style.display="none";
                break;
            case "year":
                start_date = document.getElementById("startYear").value;
                start_date = new Date(start_date);
                end_date = document.getElementById("endYear").value;
                end_date = new Date(end_date);
                end_date.setFullYear(end_date.getFullYear()+1);
                between_date.style.display="none";
                between_month.style.display="none";
                between_year.style.display="block";
                break;
    }
    if(isall ===0){
        start_date=format_date(start_date);
        end_date=format_date(end_date);
    }
    view(start_date, end_date);  
}
document.getElementById("dateBetween").addEventListener("change",selectDateBetween);

function selectBetweenDate(){
    start_date = document.getElementById("startDate").value;
    start_date = new Date(start_date);
    end_date = document.getElementById("endDate").value;
    end_date = new Date(end_date);
    end_date.setDate(end_date.getDate()+1);
    start_date=format_date(start_date);
    end_date=format_date(end_date);
    view(start_date, end_date);  
}
document.getElementById("startDate").addEventListener("change",selectBetweenDate);
document.getElementById("endDate").addEventListener("change",selectBetweenDate);

function selectBetweenMonth(){
    start_date = document.getElementById("startMonth").value;
    start_date = new Date(start_date);
    end_date = document.getElementById("endMonth").value;
    end_date = new Date(end_date);
    end_date.setMonth(end_date.getMonth()+1);
    start_date=format_date(start_date);
    end_date=format_date(end_date);
    view(start_date, end_date); 
}
document.getElementById("startMonth").addEventListener("change",selectBetweenMonth);
document.getElementById("endMonth").addEventListener("change",selectBetweenMonth);

function selectBetweenYear(){
    start_date = document.getElementById("startYear").value;
    start_date = new Date(start_date);
    end_date = document.getElementById("endYear").value;
    end_date = new Date(end_date);
    end_date.setFullYear(end_date.getFullYear()+1);
    start_date=format_date(start_date);
    end_date=format_date(end_date);
    view(start_date, end_date); 
}
document.getElementById("startYear").addEventListener("change",selectBetweenYear);
document.getElementById("endYear").addEventListener("change",selectBetweenYear);

function showSnackbar(message) {
    var snackbar = document.getElementById("snackbar");
    snackbar.textContent=message;
    snackbar.style.display = "block";
            
    setTimeout(function() {
        snackbar.style.display = "none";
    }, 3000); 
}
