<?php
$host = 'localhost';
$username = 'root';
$password = 'password';
$database = 'test';

$connection = mysqli_connect($host, $username, $password, $database);

if (!$connection) {
    die('Database connection failed: ' . mysqli_connect_error());
}

$sql = "INSERT INTO users (name, email) VALUES
        ('Ammar Ibrahim', 'abc@example.com'),
        ('Kareem Dad', 'xyz@example.com'),
        ('Danish Raza', 'gkl@example.com')";

if (mysqli_query($connection, $sql)) {
    echo "Records inserted into the users table successfully.";
} else {
    echo "Error inserting records: " . mysqli_error($connection);
}

$sql = "INSERT INTO users_address (user_id, address) VALUES
        (1, '123 X St'),
        (2, '456 Y St'),
        (3, '789 Z St'),
        (3, '456 A St')";

if (mysqli_query($connection, $sql)) {
    echo "Records inserted into the users_address table successfully.";
} else {
    echo "Error inserting records: " . mysqli_error($connection);
}

mysqli_close($connection);
