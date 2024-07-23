function category_expense(){
    console.log("hello");
    fetch('http://127.0.0.1:5000/category_expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify("hello"),
    })
        .then(response => response.json())
        .then(data => {
            
            const obj = {};
            for (let k in data.pie_10year_data) {
                const key = k;
                const value = data.pie_10year_data[k];
                obj[key] = value;
            }

            const labels = Object.keys(obj);
            const values = Object.values(obj);
            
            const ctx = document.getElementById('year_pie_chart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels.map((label, index) => `${label}: ${values[index]} dollars`), 
                    datasets: [{
                        data: values,
                        backgroundColor: [ 
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)',
                            'rgba(255, 159, 64, 0.7)',
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)'
                            
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, 
                    legend: {
                        display: true,
                        position: 'right'
                    },
                    title: {
                        display: true,
                        text: 'Expense distribution by month'
                    }
                }
            });
            
          document.getElementById("customYear_pie").addEventListener("change",month_chart_pie);
          function month_chart_pie()
              {
                  const year=document.getElementById("customYear_pie").value;
                  const dataToSend = { "year": year};
                  fetch('http://127.0.0.1:5000/category_expense1', {  
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(dataToSend),
                  })
                  .then(response => response.json())
                  .then(data => {
                      const cediv2 = document.getElementById('cediv2');
                      const existingCanvas = document.getElementById('month_chart_pie');
                      if (existingCanvas) {
                          existingCanvas.parentNode.removeChild(existingCanvas);
                      }

                      const newCanvas = document.createElement('canvas');
                      newCanvas.width = 700;
                      newCanvas.height = 300;
                      newCanvas.id = 'month_chart_pie';
                      cediv2.appendChild(newCanvas);
                      const ctx = newCanvas.getContext('2d');

                      if(data.count == 0){
                        ctx.font = "30px Arial";
                        ctx.fillStyle = "black";
                        ctx.fillText("No data to Show", 250, 160);
                        return;
                      }

                      const obj = {};
                        for (let k in data.pie_year_data) {
                            const key = k;
                            const value = data.pie_year_data[k];
                            obj[key] = value;
                        }

                        const labels = Object.keys(obj);
                        const values = Object.values(obj);
                   
                        const myChart = new Chart(ctx, {
                            type: 'pie',
                            data: {
                                labels: labels.map((label, index) => `${label}: ${values[index]} dollars`), 
                                datasets: [{
                                    data: values,
                                    backgroundColor: [ 
                                        'rgba(255, 99, 132, 0.7)',
                                        'rgba(54, 162, 235, 0.7)',
                                        'rgba(255, 206, 86, 0.7)',
                                        'rgba(75, 192, 192, 0.7)',
                                        'rgba(153, 102, 255, 0.7)',
                                        'rgba(255, 159, 64, 0.7)',
                                        'rgba(255, 99, 132, 0.7)',
                                        'rgba(54, 162, 235, 0.7)',
                                        'rgba(255, 206, 86, 0.7)',
                                        'rgba(75, 192, 192, 0.7)'
                                        
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false, 
                                legend: {
                                    display: true,
                                    position: 'right'
                                },
                                title: {
                                    display: true,
                                    text: 'Expense distribution by month'
                                }
                            }
                        });
                    })
              }
          month_chart_pie();

          document.getElementById("monthInput_pie").addEventListener("change",monthly_chart_pie);
          function monthly_chart_pie()
              {
                  const month=document.getElementById("monthInput_pie").value;
                  const dataToSend = { "month": month};
                  fetch('http://127.0.0.1:5000/category_expense2', {  
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(dataToSend),
                  })
                  .then(response => response.json())
                  .then(data => {
                      const cediv3 = document.getElementById('cediv3');
                      const existingCanvas = document.getElementById('monthly_chart_pie');
                      if (existingCanvas) {
                          existingCanvas.parentNode.removeChild(existingCanvas);
                      }

                      const newCanvas = document.createElement('canvas');
                      newCanvas.width = 700;
                      newCanvas.height = 300;
                      newCanvas.id = 'monthly_chart_pie';
                      cediv3.appendChild(newCanvas);
                      const ctx = newCanvas.getContext('2d');

                      if(data.count == 0){
                        ctx.font = "30px Arial";
                        ctx.fillStyle = "black";
                        ctx.fillText("No data to Show", 250, 160);
                        return;
                      }

                      const obj = {};
                        for (let k in data.pie_month_data) {
                            const key = k;
                            const value = data.pie_month_data[k];
                            obj[key] = value;
                        }

                        const labels = Object.keys(obj);
                        const values = Object.values(obj);
                   
                        const myChart = new Chart(ctx, {
                            type: 'pie',
                            data: {
                                labels: labels.map((label, index) => `${label}: ${values[index]} dollars`), 
                                datasets: [{
                                    data: values,
                                    backgroundColor: [ 
                                        'rgba(255, 99, 132, 0.7)',
                                        'rgba(54, 162, 235, 0.7)',
                                        'rgba(255, 206, 86, 0.7)',
                                        'rgba(75, 192, 192, 0.7)',
                                        'rgba(153, 102, 255, 0.7)',
                                        'rgba(255, 159, 64, 0.7)',
                                        'rgba(255, 99, 132, 0.7)',
                                        'rgba(54, 162, 235, 0.7)',
                                        'rgba(255, 206, 86, 0.7)',
                                        'rgba(75, 192, 192, 0.7)'
                                        
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false, 
                                legend: {
                                    display: true,
                                    position: 'right'
                                },
                                title: {
                                    display: true,
                                    text: 'Expense distribution by month'
                                }
                            }
                        });
                    })
              }
          monthly_chart_pie();


          document.getElementById("startDate_ce").addEventListener("change",choose_bet_date_ce);
          document.getElementById("endDate_ce").addEventListener("change",choose_bet_date_ce);
          function choose_bet_date_ce() {
            var start_date = document.getElementById("startDate_ce").value;
            var end_date = document.getElementById("endDate_ce").value;
        
            if (start_date !== "" && end_date !== "") {
            
                var startDate = new Date(start_date);
                var endDate = new Date(end_date);
        
                if (startDate < endDate) {
                    
                    var diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
                    if (diffInDays <= 10) {
                        custom_chart_pie(start_date, end_date);
                    } else {
                        alert("The difference between start date and end date should be less than or equal to 10 days.");
                    }
                } else {
                    alert("End date should be greater than start date.");
                }
            }
        }
          function custom_chart_pie(start_date,end_date)
              {
               
                const dataToSend = { "start": start_date,"end":end_date};
                  fetch('http://127.0.0.1:5000/category_expense3', {  
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(dataToSend),
                  })
                  .then(response => response.json())
                  .then(data => {
                      const cediv4 = document.getElementById('cediv4');
                      const existingCanvas = document.getElementById('custom_chart_pie');
                      if (existingCanvas) {
                          existingCanvas.parentNode.removeChild(existingCanvas);
                      }

                      const newCanvas = document.createElement('canvas');
                      newCanvas.width = 700;
                      newCanvas.height = 300;
                      newCanvas.id = 'custom_chart_pie';
                      cediv4.appendChild(newCanvas);
                      const ctx = newCanvas.getContext('2d');

                      if(data.count == 0){
                        ctx.font = "30px Arial";
                        ctx.fillStyle = "black";
                        ctx.fillText("No data to Show", 250, 160);
                        return;
                      }

                      const obj = {};
                        for (let k in data.pie_custom_data) {
                            const key = k;
                            const value = data.pie_custom_data[k];
                            obj[key] = value;
                        }

                        const labels = Object.keys(obj);
                        const values = Object.values(obj);
                   
                        const myChart = new Chart(ctx, {
                            type: 'pie',
                            data: {
                                labels: labels.map((label, index) => `${label}: ${values[index]} dollars`), 
                                datasets: [{
                                    data: values,
                                    backgroundColor: [ 
                                        'rgba(255, 99, 132, 0.7)',
                                        'rgba(54, 162, 235, 0.7)',
                                        'rgba(255, 206, 86, 0.7)',
                                        'rgba(75, 192, 192, 0.7)',
                                        'rgba(153, 102, 255, 0.7)',
                                        'rgba(255, 159, 64, 0.7)',
                                        'rgba(255, 99, 132, 0.7)',
                                        'rgba(54, 162, 235, 0.7)',
                                        'rgba(255, 206, 86, 0.7)',
                                        'rgba(75, 192, 192, 0.7)'
                                        
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false, 
                                legend: {
                                    display: true,
                                    position: 'right'
                                },
                                title: {
                                    display: true,
                                    text: 'Expense distribution by month'
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
document.getElementById("category-expense-button").addEventListener("click",category_expense);