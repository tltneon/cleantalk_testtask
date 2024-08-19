<?php
    class MigrateTables {
        private $queries = [
            "CREATE TABLE IF NOT EXISTS employees (
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(64),
                last_name VARCHAR(64),
                position VARCHAR(255),
                email VARCHAR(255),
                home_phone VARCHAR(20),
                notes VARCHAR(500)
            );",
            "CREATE TABLE IF NOT EXISTS employees_hierarchy (
                id INT PRIMARY KEY AUTO_INCREMENT,
                master_id INT NOT NULL,
                subordinate_id INT NOT NULL,
                FOREIGN KEY (master_id) REFERENCES employees(id),
                FOREIGN KEY (subordinate_id) REFERENCES employees(id)
            );"
        ];
        public function __construct($db) {
            $this->db = $db;
        }
        public function execute() {
            foreach ($this->queries as $query) {
                $results = $this->db->query($query);
            }
            $this->db->close();
        }
    }