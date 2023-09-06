<!DOCTYPE html>
<html>
<head>
    <title>Weather Data Viewer</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

<h1>Weather Data Viewer</h1>

<?php
// Database connection settings
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "db_weather";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if (isset($_POST['city'])) {
    $cityName = $_POST['city'];
}
else{
    $cityName = "Reigate";
}

// Query to retrieve weather data
$sql = "SELECT weather_description, weather_temperature, weather_humidity, weather_speed, weather_pressure, weather_datetimes, weather_city FROM weather WHERE weather_city = '$cityName'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<table>
    <tr>
    <th>Description</th>
    <th>Temperature</th>
    <th>Humidity</th>
    <th>Wind Speed</th>
    <th>Pressure</th>
    <th>Date Accessed</th>
    <th>City</th>
    </tr>";

    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row['weather_description']) . "</td>";
        echo "<td>" . htmlspecialchars($row['weather_temperature']) . "</td>";
        echo "<td>" . htmlspecialchars($row['weather_humidity']) . "</td>";
        echo "<td>" . htmlspecialchars($row['weather_speed']) . "</td>";
        echo "<td>" . htmlspecialchars($row['weather_pressure']) . "</td>";
        echo "<td>" . htmlspecialchars($row['weather_datetimes']) . "</td>";
        echo "<td>" . htmlspecialchars($row['weather_city']) . "</td>";
        echo "</tr>";
    }

    echo "</table>";
} else {
    echo "No weather data available.";
}

// Close connection
$conn->close();
?>

</body>
</html>
