<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "db_weather";

header('Content-Type: application/json');

// Connect to the MySQL database using mysqli
$mysqli = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($mysqli->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $mysqli->connect_error]));
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the incoming JSON data
    $rawData = file_get_contents('php://input');
    $weatherData = json_decode($rawData, true);

    // Ensure valid JSON data and required fields are present
    if ($weatherData === null || json_last_error() !== JSON_ERROR_NONE || 
        !isset($weatherData['description'], $weatherData['temperature'], $weatherData['humidity'], $weatherData['wind_speed'], $weatherData['date_accessed'], $weatherData['city'], $weatherData['pressure'])) {
        echo json_encode(['error' => 'Invalid data']);
        http_response_code(400); // Bad request
        exit();
    }

    // Insert the data into the database using prepared statement
    $stmt = $mysqli->prepare("INSERT INTO weather (weather_description, weather_temperature, weather_humidity, weather_speed, weather_datetimes, weather_city, weather_pressure) VALUES (?, ?, ?, ?, ?, ?, ?)");

    if ($stmt) {
        $stmt->bind_param('siiissi', 
            $weatherData['description'], 
            $weatherData['temperature'], 
            $weatherData['humidity'], 
            $weatherData['wind_speed'], 
            $weatherData['date_accessed'], 
            $weatherData['city'], 
            $weatherData['pressure']
        );

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Data inserted successfully!']);
        } else {
            echo json_encode(['error' => 'Database error: ' . $stmt->error]);
            http_response_code(500); // Internal server error
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Failed to prepare the query: ' . $mysqli->error]);
        http_response_code(500); // Internal server error
    }

    $mysqli->close();
} else {
    echo json_encode(['error' => 'Wrong request method']);
    http_response_code(405); // Method Not Allowed
}
?>
