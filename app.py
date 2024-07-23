from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
from collections import OrderedDict

app = Flask(__name__)
CORS(app)
table_data = []
headers = ['Item', 'Category', 'Price', 'Quantity', 'Total Price', 'Date', 'Supplier Name']
cred = credentials.Certificate("api-key")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/send_data', methods=['POST'])
def send_data():
    data = request.json  
    username=data['username']
    collection_ref = db.collection(username)
    
    
    query_snapshot = collection_ref.get()
   
    all_documents = {}
    all_documents.clear()
    
    for doc in query_snapshot:
        all_documents[doc.id] = doc.to_dict()
    
    global table_data
    table_data = []
    for receipt_key, receipt_value in all_documents.items():
        for item_value in receipt_value['items']:
            row_data = [item_value['item_name'], receipt_value['category'], item_value['price'],
                        item_value['quantity'], item_value['amount'], receipt_value['date'],
                        receipt_value['supplier_name']]
            table_data.append(row_data)
    
    response_data = {"headers":headers,'table_value': table_data}
    return jsonify(response_data)

@app.route('/search', methods=['POST'])
def search():
    data = request.json  
    value=str(data['key']).lower()
    category=data['category']
    date_format = "%Y-%m-%d"
    start = datetime.strptime(data["start"], date_format)
    end = datetime.strptime(data["end"], date_format)
    modified_data =[]
    if(category == "all"):
        for line in table_data:
            for j in line:
                if(line[5]!=None):
                    
                    date=datetime.strptime(line[5], date_format)
                    if(j != None and type(j) == str and j.lower().find(value)!=-1 and start<=date and end>=date):
                        
                        modified_data.append(line)
                        break
                else:
                    if(j != None and type(j) == str and j.lower().find(value)!=-1):
                        modified_data.append(line)
                        break
    else:
        for line in table_data:
            for j in line:
                if(line[5]!=None):
                    if(j != None and type(j) == str and j.lower().find(value)!=-1 and line[1]==category and start<=date and end>=date):
                        modified_data.append(line)
                        break
                else:
                    if(j != None and type(j) == str and j.lower().find(value)!=-1 and line[1]==category):
                        modified_data.append(line)
                        break
    
    response_data = {"headers":headers,"table_value":modified_data,"extra":[start,end,category]}
   
    return jsonify(response_data)




@app.route('/suggest', methods=['POST'])
def suggest():
    data = request.json  
    username=data['key']
    suggestion = []
    category=[]
    collection_ref = db.collection(username)
    table_data.clear()
    query_snapshot = collection_ref.get()
    all_documents = {}

    for doc in query_snapshot:
        all_documents[doc.id] = doc.to_dict()

    for receipt_key, receipt_value in all_documents.items():
        for item_value in receipt_value['items']:
            row_data = [item_value['item_name'], receipt_value['category'], item_value['price'],
                        item_value['quantity'], item_value['amount'], receipt_value['date'],
                        receipt_value['supplier_name']]
            table_data.append(row_data)
    for line in table_data:
        suggestion+=[line[0],line[1],line[6]]
        category+=[line[1]]
    category=list(set(category))
    suggestion=list(set(suggestion))
    response_data = {"sugges":suggestion,"category":category}
    return jsonify(response_data)



@app.route('/total_expense', methods=['POST'])
def total_expense():
    data = request.json 
    total=0
    year_data={2015:0,2016:0,2017:0,2018:0,2019:0,2020:0,2021:0,2022:0,2023:0,2024:0}
    for line in table_data:
        total+=int(line[4])
        year=int(line[5][:4])
        if year_data.get(year) is not None:
            year_data[year]+=int(line[4])        
    year_data = sorted(year_data.items())
    response_data = {"total":total,"year_data":year_data}
    return jsonify(response_data)



@app.route('/total_expense1', methods=['POST'])
def total_expense1():
    data = request.json 
    year1=int(data['year'])  
    month_data={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    for line in table_data:
        year2=int(line[5][:4])
        month2=int(line[5][5:7])
        if(year1==year2):
            month_data[month2]+=int(line[4]) 
    response_data = {"total":"hello","month_data":month_data}
    return response_data
    
@app.route('/total_expense2', methods=['POST'])
def total_expense2():
    data = request.json 
    month=data['month']

    month_date = datetime.strptime(month, '%Y-%m')

    #first day of the month
    start_date = month_date.replace(day=1)

    #last day of the month
    next_month = month_date.replace(day=28) + timedelta(days=4)
    end_date = next_month - timedelta(days=next_month.day)

    # Generate all dates in the month with initial value 0
    expenses = {}
    current_date = start_date
    while current_date <= end_date:
        expenses[current_date.strftime('%Y-%m-%d')] = 0
        current_date += timedelta(days=1)
    for line in table_data:
        date=line[5]
        if expenses.get(date) is not None:
            expenses[date]+=int(line[4]) 
    
    response_data = {"monthly_data":expenses}
    return response_data


   
@app.route('/total_expense3', methods=['POST'])
def total_expense3():
    data = request.json 
    start=data['start']
    end=data['end']
    start_date = datetime.strptime(start, "%Y-%m-%d")
    end_date = datetime.strptime(end, "%Y-%m-%d")
    expenses = {}
    current_date = start_date
    while current_date <= end_date:
        expenses[current_date.strftime('%Y-%m-%d')] = 0
        current_date += timedelta(days=1)
    for line in table_data:
        date=line[5]
        if expenses.get(date) is not None:
            expenses[date]+=int(line[4]) 
    
    response_data = {"monthly_data":expenses}
    return response_data

@app.route('/category_expense', methods=['POST'])
def category_expense():
    data = request.json 
    expenses={}
    for line in table_data:
        cat=line[1]
        if expenses.get(cat) is not None:
            expenses[cat]+=int(line[4]) 
        else:
            expenses[cat]=int(line[4]) 
    response_data = {"pie_10year_data":expenses}
    return response_data

@app.route('/category_expense1', methods=['POST'])
def category_expense1():
    data = request.json 
    year1=int(data['year'])  
    expenses={}
    cnt=0
    for line in table_data:
        cat=line[1]
        year2=int(line[5][:4])
        if (expenses.get(cat) is not None and year1==year2):
            expenses[cat]+=int(line[4])
        elif(expenses.get(cat) is None and year1==year2):
            expenses[cat]=int(line[4]) 
            cnt+=1 
    response_data = {"pie_year_data":expenses,"count":cnt}
    return response_data

@app.route('/category_expense2', methods=['POST'])
def category_expense2():
    data = request.json 
    month1=data['month']
    expenses={}
    cnt=0
    for line in table_data:
        cat=line[1]
        month2=line[5][:7]
        if (expenses.get(cat) is not None and month1==month2):
            expenses[cat]+=int(line[4])
        elif(expenses.get(cat) is None and month1==month2):
            expenses[cat]=int(line[4]) 
            cnt+=1 
    response_data = {"pie_month_data":expenses,"count":cnt}
    return response_data


@app.route('/category_expense3', methods=['POST'])
def category_expense3():
    data = request.json 
    start=data['start']
    end=data['end']
    start_date = datetime.strptime(start, "%Y-%m-%d")
    end_date = datetime.strptime(end, "%Y-%m-%d")
    expenses={}
    cnt=0
    for line in table_data:
        cat=line[1]
        current_date= datetime.strptime(line[5], "%Y-%m-%d")
        if (expenses.get(cat) is not None and current_date>=start_date and current_date<=end_date):
            expenses[cat]+=int(line[4])
        elif(expenses.get(cat) is None and current_date>=start_date and current_date<=end_date):
            expenses[cat]=int(line[4]) 
            cnt+=1 
    response_data = {"pie_custom_data":expenses,"count":cnt}
    return response_data

if __name__ == '__main__':
    app.run(debug=True)



    