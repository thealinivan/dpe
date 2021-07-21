# dpe - Dynamic Pricing in Ecommerce

A plugin that can be intergrated in E-commerce platforms of any kind to facilitate dynamic pricing referencing Amazon, Ebay etc
Note this is a proof of concept and not a production build

## Requirements
Code editor -> https://code.visualstudio.com/
API Key -> https://rapidapi.com/ajmorenodelarosa/api/amazon-price1/


## Setup a local environment:

### Clone repository on a local machine

### API setup
Setup the API and retrieve your API key here 
```
https://rapidapi.com/ajmorenodelarosa/api/amazon-price1/
```

### config.js file
Create a file named `config.js` in yout root folder and paste the following code adding your api key
```
const config = {
    amazonAPIKey: "your api key"
}
```

## Run in your local environment
All you need to do is run the index.html file from CLI or by double-clicking the icon in explorer view.

You can now simulate a dynamic pricing e-commerce environment referencing Amazon pricing for the products.
Target e-commerce platform aquisition and sale prices are simulated by generating random prices in a range derived from Aamazon API response.
Logs in console have been added to enhance your understanding on how the plugin works.

As this plugin is currently in development, any contributions welcomed by following the steps bellow:
1. Fork project
2. Clone locally
3. Add your work
4. Push on YOUR fork
5. Create a pull request to codebase

I will check my account regularly so that I can keep the codebase updated.

I believe in an open source world and working on it.
