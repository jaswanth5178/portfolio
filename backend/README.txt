JASWANTH PORTFOLIO - JAVA + MYSQL BACKEND

WHAT IS CONNECTED
-----------------
The portfolio contact form is connected to a Java backend.

Frontend:
    index.html
    script.js
    style.css

Backend:
    Java HttpServer
    Port 8090

Database:
    MySQL
    Database: portfolio_db
    Table: contact_messages

API
---
GET  http://localhost:8090/api/health
POST http://localhost:8090/api/contact

POST JSON:
{
  "name": "Jaswanth",
  "email": "example@gmail.com",
  "message": "Hello"
}

SETUP
-----
1. Make sure MySQL Server is running.
2. Open MySQL Workbench.
3. Open backend/database.sql and execute it.
4. Put mysql-connector-j-9.7.0.jar inside:
       backend/lib/
5. Open backend/src/PortfolioServer.java.
6. Change:
       DB_USER
       DB_PASSWORD
   to your MySQL username/password.
7. Open PowerShell inside the backend folder.
8. Run:
       powershell -ExecutionPolicy Bypass -File .\run-backend.ps1
9. Confirm this works in the browser:
       http://localhost:8090/api/health
10. Start the portfolio with Live Server.

IMPORTANT
---------
Do not open index.html directly with file:// if the browser blocks requests.
Use VS Code Live Server, for example:
http://127.0.0.1:5500/index.html

The Email/GitHub/LinkedIn links remain unchanged.
Only the portfolio contact form is now connected to Java + MySQL.
