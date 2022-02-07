<?php
	$inData = getRequestInfo();
	
	$firstName= $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$id = $inData["ID"];
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (ID, FirstName, LastName, Email, PhoneNumber, ID) VALUES (?,?,?,?,?)");
		$stmt->bind_param("sssss", $id, $firstName, $lastName, $email, $phoneNumber);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>