<?php
    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $first_name = strip_tags(trim($_POST["first_name"]));
        $first_name = str_replace(array("\r","\n"),array(" "," "),$first_name);
        $last_name = strip_tags(trim($_POST["last_name"]));
        $last_name = str_replace(array("\r","\n"),array(" "," "),$last_name);
        $company = strip_tags(trim($_POST["company"]));
        $company = str_replace(array("\r","\n"),array(" "," "),$company);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL); 
        $phone = trim($_POST["phone"]);

        // Check that data was sent to the mailer.
        if ( empty($first_name) || empty($last_name) || empty($company) || empty($phone) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "Oops! There was a problem with your submission. Please complete the form and try again.";
            exit;
        }

        // Set the recipient email address.
        $recipient = "carensdorf@cloudscionconsulting.com";

        // Set the email subject.
        $subject = "Demo Request from $first_name $last_name";

        // Build the email content.
        $email_content = "First Name: $first_name\n";
        $email_content .= "Last Name: $last_name\n";
        $email_content .= "Company: $company\n";
        $email_content .= "Email: $email\n";
        $email_content .= "Phone: $phone\n";

        // Build the email headers.
        $email_headers = "From: $first_name $last_name <$email>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thank You! Your request has been sent.";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your request.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>
