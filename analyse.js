let current_item = "mypage";

function w3_open() {
    document.getElementById("all").style.marginLeft = "15%";
    document.getElementById("mySidebar").style.width = "15%";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
}


function w3_close() {
    document.getElementById("all").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
}

function change(item, display_name) {
    document.getElementById(current_item).style.display = "none";
    document.getElementById(item).style.display = "block";
    document.getElementById("header_name").textContent = display_name;
    current_item = item;
   
}

var input = document.getElementById("search");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter" ) {
    event.preventDefault();
    search();
  }
});


input.addEventListener('input', function(event) {
    const search_value = document.getElementById("search").value;
    if(search_value===""){
        search();
        
    }
});
  
function search() {
    const search_value = document.getElementById("search").value;
    const category = document.getElementById("categorySelect").value;
    start_date = document.getElementById("startDate").value;
    end_date = document.getElementById("endDate").value;
    
    const dataToSend = { key: search_value ,"category":category,"start":start_date,"end":end_date};

    fetch('http://127.0.0.1:5000/search', {  // Use the correct URL for your Flask server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
    .then(response => response.json())
    .then(data => {
        
        const headers = data.headers;
        const tableData = data.table_value;
        const tableContainer = document.getElementById('table-container');
        

            if(tableData.length === 0){
                tableContainer.innerHTML = ''; 
                const text = document.createElement("h4");
                text.textContent="No Data to Show";
                tableContainer.appendChild(text);
            }
            else{
                const table = document.createElement('table');
                table.setAttribute('cellpadding', '0');
                table.setAttribute('cellspacing', '0');
                table.setAttribute('border', '0');

                // Create table header
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');

                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.appendChild(document.createTextNode(headerText));
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);
                // Create table body
                const tbody = document.createElement('tbody');
                tableData.forEach(lineValue => {
                    const row = document.createElement('tr');

                    lineValue.forEach(value => {
                        const cell = document.createElement('td');
                        cell.appendChild(document.createTextNode(value));
                        row.appendChild(cell);
                    });

                    tbody.appendChild(row);
                });

                table.appendChild(tbody);
               
                tableContainer.innerHTML = ''; 
                tableContainer.appendChild(table);
            }

    })
    .catch(error => {
        console.error('Error:', error);
    });
}


const searchInput = document.getElementById('search');
const suggestionBox = document.getElementById('suggestion-box');

var filteredSuggestions;
let selectedSuggestionIndex = -1;
var suggestions;

function suggest() {
    const dataToSend = { key: "harish" };

    fetch('http://127.0.0.1:5000/suggest', {  // Use the correct URL for your Flask server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('suggestions', JSON.stringify(data.sugges));
        localStorage.setItem('category', JSON.stringify(data.category));
});
}    
suggest();
    
function DateRangeSelect() {
    const category = JSON.parse(localStorage.getItem('category')) || [];

    const selectElement = document.getElementById("categorySelect");
    category.forEach(categoryItem => {
        const optionElement = document.createElement("option");
        optionElement.setAttribute("value", categoryItem);
        optionElement.textContent = categoryItem;
        selectElement.appendChild(optionElement);
    });
}
DateRangeSelect();



searchInput.addEventListener('input',function() {
 
    const searchText = this.value.toLowerCase();
    suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];

    filteredSuggestions = (suggestions || []).filter(suggestion => {
        // Check if suggestion is a non-null string before applying string functions
        return (
            typeof suggestion === 'string' &&
            suggestion.toLowerCase().includes(searchText)
        );
    });
    
    selectedSuggestionIndex = -1;
    if (searchText === "") {
        suggestionBox.style.display = 'none';
    } else {
        displaySuggestions(filteredSuggestions);
    }
   
});



function displaySuggestions(suggestionsArray) {
    const suggestionList = suggestionsArray.map((suggestion, index) => {
        const isSelected = index === selectedSuggestionIndex ? 'selected' : '';
        return `<div class="suggestion-item ${isSelected}" data-index="${index}">${suggestion}</div>`;
    }).join('');

    suggestionBox.innerHTML = suggestionList; 
    suggestionBox.style.display = suggestionsArray.length ? 'block' : 'none';
}

suggestionBox.addEventListener('click', function(event) {
    if (event.target.classList.contains('suggestion-item')) {
        const selectedText = event.target.textContent;
        fillInput(selectedText);
    }
});

searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        handleArrowKey(event.key);
    } else if (event.key === 'Enter') {
        if (selectedSuggestionIndex !== -1) {
            const selectedText = filteredSuggestions[selectedSuggestionIndex];
            fillInput(selectedText);
            selectedSuggestionIndex = -1;
        } 
    }
});


function handleArrowKey(key) {
    const suggestionItems = document.querySelectorAll('.suggestion-item');

    if (suggestionItems.length === 0) {
        return;
    }
    selectedSuggestionIndex = key === 'ArrowDown'
        ? Math.min(selectedSuggestionIndex + 1, suggestionItems.length - 1)
        : Math.max(selectedSuggestionIndex - 1, 0);

    suggestionItems.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedSuggestionIndex);
    });
}

function fillInput(text) {
    searchInput.value = text;
    suggestionBox.style.display = 'none';
}
