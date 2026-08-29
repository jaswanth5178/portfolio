$ErrorActionPreference = "Stop"

# Put mysql-connector-j-9.7.0.jar inside backend\lib\
$jar = "lib\mysql-connector-j-9.7.0.jar"

if (!(Test-Path $jar)) {
    Write-Host "ERROR: MySQL Connector/J jar not found."
    Write-Host "Copy mysql-connector-j-9.7.0.jar into backend\lib\"
    exit 1
}

if (!(Test-Path "out")) {
    New-Item -ItemType Directory -Path "out" | Out-Null
}

Write-Host "Compiling backend..."
javac -cp $jar -d out src\PortfolioServer.java

Write-Host "Starting backend on http://localhost:8090 ..."
java -cp "out;$jar" PortfolioServer
