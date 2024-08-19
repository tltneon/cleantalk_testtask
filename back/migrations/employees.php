<?php
    class MigrateEmployees {
        private $names = ["John", "Jane", "Michael", "Sarah", "Robert", "Jessica", "David", "Emily", "James", "Emma", "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"];
        private $positions = ["Manager", "Developer", "Administrator"];

        function generate_random_email($first_name, $last_name) {
            $domains = ["gmail.com", "ya.ru"];
            return strtolower($first_name) . '.' . strtolower($last_name) . '@' . $domains[array_rand($domains)];
        }

        function generate_random_notes() {
            $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
            $length = rand(10, 20);
            $notes = '';
            for ($i = 0; $i < $length; $i++) {
                $notes .= $characters[rand(0, strlen($characters) - 1)];
            }
            return $notes;
        }
        public function __construct($db) {
            $this->db = $db;
        }
        public function execute() {
            for ($i = 0; $i < 10000; $i++) { // неоптимальный способ
                $first_name = $this->names[array_rand($this->names)];
                $last_name = $this->names[array_rand($this->names)];
                $position = $this->positions[array_rand($this->positions)];
                $email = $this->generate_random_email($first_name, $last_name);
                $home_phone = '+7-' . rand(100, 999) . '-' . rand(100, 999) . '-' . rand(1000, 9999);
                $notes = $this->generate_random_notes();
                $results = $this->db->query("INSERT INTO employees (first_name, last_name, position, email, home_phone, notes) VALUES ('$first_name', '$last_name', '$position', '$email', '$home_phone', '$notes');");
            }
            $this->db->close();
        }
    }