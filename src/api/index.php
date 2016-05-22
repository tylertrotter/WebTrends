<?php
    header('Content-type: application/json');

    $dbh = new PDO('pgsql:host=localhost;dbname=tylertrotter');
    $db = pg_connect("dbname=tylertrotter") or die("Could not connect");

    if( isset($_GET['field']) && $_GET['field'] == 'frontend' ){
        $field = 'Front-End Developer';
    }else if( isset($_GET['field']) && $_GET['field'] == 'backend' ){
        $field = 'Back-End Developer';
    }else if( isset($_GET['field']) && $_GET['field'] == 'design' ){
        $field = 'UI/UX Designer';
    }else{
      echo 'Error: Field value not set.';
      die;
    }

    $start = isset($_GET['start']) ? $_GET['start'] : '2016-04-01';
    $end = isset($_GET['end']) ? $_GET['end'] : '2016-05-15';

    $startQ = " AND date >= '" . $start . "'";
    $endQ = " AND date <= '" . $end . "'";
    $fieldQ = "field = '" . $field  . "'";
    $regionQ = isset($_GET['region']) ? " AND region ~* '" . $_GET['region'] . "'" : " ";
    $cityQ = isset($_GET['city']) ? " AND city ~* '" . $_GET['city'] . "'" : " ";
    $query = "SELECT * FROM skill WHERE " . $fieldQ . $startQ . $endQ . $regionQ . $cityQ;
    $result = pg_query($db, $query);

    $months = getMonths($start, $end);

    $allTime = [];
    foreach(pg_fetch_all($result) as $skill){
        array_push($allTime, $skill['skill']);
        array_push($months[substr($skill['date'], 0, 7)], $skill['skill']);
    }

    $allTime = array_count_values($allTime);
    arsort($allTime);

    echo '{"total":[';
    $i = 0;
    foreach($allTime as $key => $skill){
      if( $i > 0 ){
        echo ',';
      }
      echo '{"' . $key . '": "' . $skill . '"}';
      $i++;
    }
    echo '],"dates":[';

    $i = 0;
    foreach($months as $key => $month){
        if( $i > 0 ){
          echo ',';
        }
        $month = array_count_values($month);
        arsort($month);
        echo '{"' . $key . '":[';
        $j = 0;
        foreach($month as $key => $skill){
            if( $j > 0 ){
              echo ',';
            }
            echo '{"' . $key . '":"' . $skill . '"}';
            $j++;
        }
        echo ']}';
        $i++;
    }
    echo ']}';

    function getMonths($start, $end){
        $monthsInRange = getMonthsInRange($start, $end);
        $months[beforeLast('-', $start)] = [];
        for ($i = 1; $i <= $monthsInRange; $i++) {
            $start = incrementMonth($start);
            $months[beforeLast('-', $start)] = [];
        }
        return $months;
    }

    function getMonthsInRange($start, $end){
        return (0 - getMonthNum($start) + ((getYearNum($end) - getYearNum($start)) * 12) + getMonthNum($end));
    }

    function getYearNum($date){
        return explode('-', $date)[0];
    }

    function getMonthNum($date){
        return explode('-', $date)[1];
    }

    function getDayNum($date){
        return explode('-', $date)[2];
    }

    function incrementMonth($date){
        if( getMonthNum($date) == 12 ){
            $month = 1;
            $year = getYearNum($date)+1;
        }else{
            $month = getMonthNum($date)+1;
            $year = getYearNum($date);
        }

        return $year . '-' . sprintf('%02d', $month) . '-' . getDayNum($date);
    }

    function beforeLast ($this, $inthat){
        return substr($inthat, 0, strrevpos($inthat, $this));
    }
    function strrevpos($instr, $needle){
        $rev_pos = strpos (strrev($instr), strrev($needle));
        if ($rev_pos===false) return false;
        else return strlen($instr) - $rev_pos - strlen($needle);
    }
?>
