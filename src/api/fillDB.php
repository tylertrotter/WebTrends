<?php

    $dbh = new PDO('pgsql:host=localhost;dbname=tylertrotter');
    $db = pg_connect("dbname=tylertrotter") or die("Could not connect");

    // If cache date is less than today's date, get data from SO.
    $result = pg_query($db, "SELECT date FROM expiration WHERE dbtable = 'skill'");
    $cacheDate = pg_fetch_row($result)[0];

    $date = getdate();
    $formattedDate = $date['year'] . '-' . sprintf('%02d', $date['mon']) . '-' . sprintf('%02d', $date['mday']);

    if( $formattedDate > $cacheDate){
     updateSkills($formattedDate, $cacheDate, $db);
    }else{
       echo 'No new data to get.';
    }
    
    function updateSkills($today, $cacheDate, $db){
    
        $searchTerms = ['Front-End Developer', 'UI/UX Designer', 'Back-End Developer'];
        $rowsUpdated = 0;
        
        foreach ( $searchTerms as $searchTerm ){
            $feed = 'http://stackoverflow.com/jobs/feed?searchTerm=' . urlencode($searchTerm);
            $xml = file_get_contents($feed);
            $convertedXml = simplexml_load_string($xml);

            $jobPostings = $convertedXml->channel[0]->item;

            foreach ($jobPostings as $posting){
                $date = $posting->pubDate;
                $dateTime = new DateTime($date); 
                $dateOfPosting = date_format($dateTime, 'Y-m-d');
                
                if($dateOfPosting >= $cacheDate){
                    $field = $searchTerm;
                    if( $searchTerm == 'UI/UX Designer'){
                        if( stripos($posting->title, 'designer') == 0 ){ continue; }
                    }
                    
                    $location = $posting->location;
                    foreach($posting->category as $skill){
                        $locationParts = explode(',', $location);
                        $city = $locationParts[0];
                        $region = trim($locationParts[count($locationParts)-1]);
                        $inUS = isInUSA($region);
                       
                        $dbInput = "'" . $skill . "','" . $date . "','" . $field . "',$$" . $city . "$$,$$" . $region . "$$,'" . $inUS . "'";
                        $rowsUpdated++;
                        pg_query($db, "INSERT INTO skill(skill,date,field,city,region,usa) VALUES(" . $dbInput . ");");
                    }
                }
            }
        }
        
        echo $rowsUpdated . ' rows updated.';
        
        // Update cache date
        pg_query($db, "UPDATE expiration SET date = '" . $today . "' WHERE dbtable = 'skill'");
    }

    function isInUSA($region){
        $states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
        if (in_array($region, $states)){
            return 'true';
        }else{
            return 'false';
        }
    }

?>
