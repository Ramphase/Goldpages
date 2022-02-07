<?php
	$inData = getRequestInfo();
	

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$id = $inData["ID"];
	$cid = $inData["CID"];
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, PhoneNumber=? WHERE ID=? AND CID=?");
		$stmt->bind_param("ssss", $firstName, $lastName, $email, $phoneNumber, $id, $cid);
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