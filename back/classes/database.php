<?php
    class Database {
        private $host;
        private $username;
        private $password;
        private $dbname;
        private $conn;

        public function __construct($host, $username, $password, $dbname) {
            $this->host = $host;
            $this->username = $username;
            $this->password = $password;
            $this->dbname = $dbname;
            $this->connect();
        }

        private function connect() {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->dbname);
            if ($this->conn->connect_error) {
                die("Connection failed: " . $this->conn->connect_error);
            }
        }

        public function query($sql) {
            $result = $this->conn->query($sql);
            if ($this->conn->error) {
                throw new Exception("Error: " . $this->conn->error);
            }
            return $result;
        }

        public function fetchAll($sql) {
            $result = $this->query($sql);
            try {
                return $result->fetch_all(MYSQLI_ASSOC);
            } catch (Exception) {
                return [];
            }
        }

        public function escapeString($str) {
            return $this->conn->real_escape_string($str);
        }

        public function prepare($str) {
            return $this->conn->prepare($str);
        }

        public function getLastId() {
            return $this->conn->insert_id;
        }

        public function close() {
            $this->conn->close();
        }
    }