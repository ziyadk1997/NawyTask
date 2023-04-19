# Nawy's Task by Ziyad Khaled

# Steps to run :

1 - Git clone the project into your local machine, making sure Next.js, Node.js and React Native are installed

2 - cd to Backend in the terminal and execute npm install then npm start

3 - you can add apartments using postman with url 'http://localhost:8100/api/apartment/addApartment' with the body containing these properties "name"(String),"price"(number),"description"(String),"location"(String)
eg:
{
"name":"Appartment 2",
"price":1000,
"location":"tagamo3",
"description":"test test"
}

3 - cd to Frontend in terminal and execute npm run build then npm start , frontend should be accessible on localhost:3000

4 - cd to ReactApp in terminal and execute npx expo start then use any emulator you like to test app
