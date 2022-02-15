<?php
	
	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	$id = $inData["userId"];
	$str = "%" . $inData["search"] . "%";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		if($str == ""){ //search with empty string returns all contacts with userid
			$stmt = $conn->prepare("SELECT FirstName, LastName, Email, PhoneNumber FROM Contacts WHERE ID=?");
			$stmt->bind_param("i", $id);

		} else{

			if(preg_match('/\s/', $str)){
				$str = preg_replace('/\s/', '', $str);
			}

			$stmt = $conn->prepare("SELECT CID, FirstName, LastName, Email, PhoneNumber FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ?) AND ID=?");
			$stmt->bind_param("sssi", $str, $str, $str, $id);
		}
		$stmt->execute();
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{';
			$searchResults .= '"contId":' . $row['CID'] . ',';
			$searchResults .= '"firstName":"' . $row['FirstName'] . '",';
			$searchResults .= '"lastName":"' . $row['LastName'] . '",';
			$searchResults .= '"email":"' . $row['Email'] . '",';
			$searchResults .= '"phoneNumber":"' . $row['PhoneNumber'] . '"';
			$searchResults .= '}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
