<?php


class Draw {

    /**
     * @var DateTime
     */
    private $relativeDate;

    public function nextValidDrawDate(DateTime $relativeDate = null)
    {
        $this->relativeDate = $relativeDate ?: new DateTime();

        $relativeDate1 = clone $this->relativeDate;
        $relativeDate2 = clone $this->relativeDate;

        $relativeDate1->modify('next Monday');
        $relativeDate2->modify('next Thursday');

        $day = $this->relativeDate->format('D');
        $hours = $this->relativeDate->format('H');
        $minutes = $this->relativeDate->format('i');

        //When today is still a valid draw date
        if(in_array($day, ['Mon', 'Thu']) && $hours < 21 && $minutes < 30){
            return $this->relativeDate->format('Y-m-d');
        }

        //When Monday is closer to the relative date
        if($relativeDate1 < $relativeDate2){
            return $relativeDate1->format('Y-m-d');
        }else{
            //When next Thursday is closer to the relative date
            return $relativeDate2->format('Y-m-d');
        }
    }
}

$drawInstance = new Draw();

$result = $drawInstance->nextValidDrawDate(new DateTime('2019-04-29 10:00'));
echo $result.PHP_EOL;//2019-04-29

$result = $drawInstance->nextValidDrawDate(new DateTime('2019-04-30 10:00'));
echo $result.PHP_EOL;//2019-05-02