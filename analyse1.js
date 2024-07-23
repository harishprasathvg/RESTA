
function viewItems() {
    const loading = document.getElementById('s1');
    const div1 = document.getElementById("div1");
    div1.style.filter="blur(3.8px)";
    loading.style.display='block';
    div1.style.pointerEvents="none";
    
    document.body.style.overflow = 'hidden';

    const dataToSend = { username: 'harish' };

    fetch('http://127.0.0.1:5000/send_data', {
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
        loading.style.display='none';
        div1.style.filter="blur(0)";
        div1.style.pointerEvents="auto";
        document.body.style.overflow = 'auto';
        
}
document.getElementById("viewitemsbutton").addEventListener("click",viewItems);
viewItems();


function total_expense(){

    fetch('http://127.0.0.1:5000/total_expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify("hello"),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("total").textContent="Total Expense : "+data.total;
              const obj = {};
              data.year_data.forEach(item => {
                  const key = item[0];
                  const value = item[1];
                  obj[key] = value;
              });
              const ctx = document.getElementById('year_chart').getContext('2d');
              const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: Object.keys(obj),
                  datasets: [{
                    label: 'Expense in $',
                    data: Object.values(obj),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                  }]
                },
                options: {
                  scales: {
                    xAxes: [{
                      type: 'time',
                      time: {
                        unit: 'month'
                      },
                      scaleLabel: {
                        display: true,
                        labelString: 'Date'
                      }
                    }],
                    yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Value'
                      }
                    }]
                  }
                }
              });
            

          document.getElementById("customYear").addEventListener("change",month_chart);
          function month_chart()
              {
                  const year=document.getElementById("customYear").value;
                  const dataToSend = { "year": year};
                  fetch('http://127.0.0.1:5000/total_expense1', {  
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(dataToSend),
                  })
                  .then(response => response.json())
                  .then(data => {
                      
                      const existingCanvas = document.getElementById('month_chart');
                      if (existingCanvas) {
                          existingCanvas.parentNode.removeChild(existingCanvas);
                      }
                      const newCanvas = document.createElement('canvas');
                      newCanvas.id = 'month_chart';
                      const tediv2 = document.getElementById('tediv2');
                      tediv2.appendChild(newCanvas);
                      const ctx = newCanvas.getContext('2d');

                      const temp=["", "JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
                      const obj = {};

                      for (var i=1;i<=12;i++){
                        const key = temp[i];
                        const value = data.month_data[i];
                        obj[key] = value;
                      }
                   
                      const myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                          labels: Object.keys(obj),
                          datasets: [{
                            label: 'Expense in $',
                            data: Object.values(obj),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                          }]
                        },
                        options: {
                          scales: {
                            xAxes: [{
                              type: 'time',
                              time: {
                                unit: 'month'
                              },
                              scaleLabel: {
                                display: true,
                                labelString: 'Date'
                              }
                            }],
                            yAxes: [{
                              ticks: {
                                  beginAtZero: true // Ensure the scale starts from zero
                              },
                              scaleLabel: {
                                  display: true,
                                  labelString: 'Expense in $' // Adjust the label string as needed
                              }
                          }]
                          }
                        }
                      });
                  })
              }
          month_chart();

          document.getElementById("monthInput").addEventListener("change",monthly_chart);
          function monthly_chart()
              {
                var month = document.getElementById("monthInput").value;
                  const dataToSend = { "month": month};
                 fetch('http://127.0.0.1:5000/total_expense2', {  
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(dataToSend),
                  })
                  .then(response => response.json())
                  .then(data => {
                      
                      const existingCanvas = document.getElementById('monthly_chart');
                      if (existingCanvas) {
                          existingCanvas.parentNode.removeChild(existingCanvas);
                      }
                      const newCanvas = document.createElement('canvas');
                      newCanvas.id = 'monthly_chart';
                      const tediv3 = document.getElementById('tediv3');
                      tediv3.appendChild(newCanvas);
                      const ctx = newCanvas.getContext('2d');
                      
                      
                      const obj = {};
                      for (let k in data.monthly_data) {
                          const key = k;
                          const value = data.monthly_data[k];
                          obj[key] = value;
                      }
                      
                      const myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                          labels: Object.keys(obj),
                          datasets: [{
                            label: 'Expense in $',
                            data: Object.values(obj),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                          }]
                        },
                        options: {
                          scales: {
                            xAxes: [{
                              type: 'time',
                              time: {
                                unit: 'month'
                              },
                              scaleLabel: {
                                display: true,
                                labelString: 'Date'
                              }
                            }],
                            yAxes: [{
                              ticks: {
                                  beginAtZero: true // Ensure the scale starts from zero
                              },
                              scaleLabel: {
                                  display: true,
                                  labelString: 'Expense in $' // Adjust the label string as needed
                              }
                          }]
                          }
                        }
                      });
                  })
              }
              monthly_chart()

              document.getElementById("startDate_te").addEventListener("change",choose_bet_date);
              document.getElementById("endDate_te").addEventListener("change",choose_bet_date);
              function choose_bet_date() {
                var start_date = document.getElementById("startDate_te").value;
                var end_date = document.getElementById("endDate_te").value;
            
                if (start_date !== "" && end_date !== "") {
                
                    var startDate = new Date(start_date);
                    var endDate = new Date(end_date);
            
                    if (startDate < endDate) {
                        
                        var diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
                        if (diffInDays <= 10) {
                            bet_date_chart(start_date, end_date);
                        } else {
                            alert("The difference between start date and end date should be less than or equal to 10 days.");
                        }
                    } else {
                        alert("End date should be greater than start date.");
                    }
                }
            }
            
              function bet_date_chart(start_date,end_date)
              {
                  const dataToSend = { "start": start_date,"end":end_date};
                 fetch('http://127.0.0.1:5000/total_expense3', {  
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(dataToSend),
                  })
                  .then(response => response.json())
                  .then(data => {
                      
                      const existingCanvas = document.getElementById('bet_date_chart');
                      if (existingCanvas) {
                          existingCanvas.parentNode.removeChild(existingCanvas);
                      }
                      const newCanvas = document.createElement('canvas');
                      newCanvas.id = 'bet_date_chart';
                      const tediv3 = document.getElementById('tediv4');
                      tediv3.appendChild(newCanvas);
                      const ctx = newCanvas.getContext('2d');
                      
                      
                      const obj = {};
                      for (let k in data.monthly_data) {
                          const key = k;
                          const value = data.monthly_data[k];
                          obj[key] = value;
                      }
                      console.log(obj);
                      const myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                          labels: Object.keys(obj),
                          datasets: [{
                            label: 'Expense in $',
                            data: Object.values(obj),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                          }]
                        },
                        options: {
                          scales: {
                            xAxes: [{
                              type: 'time',
                              time: {
                                unit: 'month'
                              },
                              scaleLabel: {
                                display: true,
                                labelString: 'Date'
                              }
                            }],
                            yAxes: [{
                              ticks: {
                                  beginAtZero: true // Ensure the scale starts from zero
                              },
                              scaleLabel: {
                                  display: true,
                                  labelString: 'Expense in $' // Adjust the label string as needed
                              }
                          }]
                          }
                        }
                      });
                  })
              }

            })
        .catch(error => {
            console.error('Error:', error);
        });
}
document.getElementById("total-expense-button").addEventListener("click",total_expense);

