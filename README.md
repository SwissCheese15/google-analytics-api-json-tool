# Google Analytics Reporting API Tool

This tool can be used to retrieve data via the Google Analytics Reporting API.
The raison-d-être of this tool is the fact that the API limits it's responses by 1000.
If someone wants to retrieve large amounts of data, dozens or hundreds of separate requests have to be made.

With this tool, these requests are automatically executed and the reveived data is gathered and combined.

## Output
A JSON file with the data of all the chained requests.

## Usage
- Select what metrics you want incuded
- Choose one of the Dimensions
- Choose a time granularity 
- Choose the date range to be included
- Click on **GET JSON File**
- Profit

## How to this project to run on your machine:
- Go to Google Cloud Plattform -> IAM & Admin -> Service Accounts -> Keys
- Generate a JSON File with API Credentials
- Put the file in the root of the project and name it `key.json`
- In the index.js file, where it says `INSERT_VIEW_ID` add your google analytics view ID
- Run the following in the command line `npm install`
- You can use the VS Code Live Server Extention to run the `index.html` file
- Make sure you have **node** installed
- Use node to run the `index.js` server file. You can do that by running `node index.js`in the command line





