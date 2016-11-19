<?php

class Dog {
	public $id;
	public $rname;
	public $cname;
	public $dob;
	public $sire_id;
	public $dam_id;
	public $gender;
	public $list_priority;
	public $available;
	public $display;
	public $comments;
	

		function get_id() {
			return $this->id;	
		}
		
		function get_rname() {
			return $this->rname;	
		}
		
		function get_cname() {
			return $this->cname;	
		}
		
		function get_display_name() {
			$display_name;
			
			if ($this->rname && $this->cname){ 
				$display_name = $this->rname." - \" " .  $this->cname . "\"";
			} elseif($this->rname) {
				$display_name = $this->rname;
			} elseif($this->cname) {
				$display_name = $this->cname;
			} else {
				$display_name = "#".$this->id . " - Name not populated";
			}
			
			return $display_name;
		}
		
		function get_dob_display() {
			$fmDate = date("M d Y", strtotime($this->dob));
			return $fmDate;	
		}
		function get_dob() {
			return $this->dob;	
		}
		

		
		function get_sire_id() {
			return $this->sire_id;		
		}
		
		function get_dam_id() {
			return $this->dam_id;	
		}
		
		function get_dam() {
			return $this->dam;	
		}

// gender is stored in sql as 1 = male and 0 = female
		
		function get_gender() {
			$gender;
			if ($this->gender) {
				$gender = 'male';
			} else {
				$gender = 'female';
			}

			return $gender;	
		}
		
		function get_list_priority() {
			return $this->list_priority;	
		}
		function get_available() {	
			return $this->available;	
		}
		
		function get_display() {	
			return $this->display;	
		}
		function get_comments() {	
			return $this->comments;	
		}
}

?>