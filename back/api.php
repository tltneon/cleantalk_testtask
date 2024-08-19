<?php
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *'); //
    header('Access-Control-Allow-Methods: *'); //
    header('Access-Control-Allow-Headers: *'); //
    include('classes/database.php');

    class API {
        public $db;
        private $code = 200;
        public function __construct() {
            $this->db = new Database('localhost', 'root', '', 'symfony');
        }
        public function setCode($code) {
            $this->code = $code;
        }
        public function send($results) {
            echo json_encode($results); 
            $this->db->close();
            http_response_code($this->code);
            exit;
        }
    }

    $api = new API();
    $db = $api->db;

    try {
        if (isset($_GET['task'])) {
            $task = $_GET['task'];
            if ($task === 'migrate') {
                include('migrations/tables.php');
                $migr = new MigrateTables($db);
            }
            if ($task === 'fill') {
                include('migrations/employees.php');
                $migr = new MigrateEmployees($db);
            }
            if (isset($migr)) {
                $migr->execute();
            } else {
                http_response_code(500);
            }
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (isset($_GET['employeeid'])) {
                $employeeid = (int) $_GET['employeeid'];
                $results = $db->fetchAll("SELECT a.*, b.master_id FROM employees a LEFT JOIN employees_hierarchy b ON a.id = b.subordinate_id WHERE a.id = {$employeeid} LIMIT 1");
                $api->send($results);
            }

            $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 40;
            $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
            $offset = ($page - 1) * $limit;

            if (isset($_GET['find'])) {
                $find = $db->escapeString($_GET['find']);
                $results = $db->fetchAll("SELECT id, first_name, last_name, position FROM employees WHERE first_name LIKE '%{$find}%' or last_name LIKE '%{$find}%' LIMIT {$limit}");
                $api->send($results);
            }
            if (isset($_GET['master'])) {
                $master = (int) $_GET['master'];
                if ($master > 0) {
                    $master = "= {$master}";
                } else {
                    $master = "IS null";
                }
                $results = $db->fetchAll("
                    SELECT a.id, a.first_name, a.last_name, a.position, b.master_id FROM employees a
                    left JOIN employees_hierarchy b ON a.id = b.subordinate_id
                    WHERE b.master_id {$master} LIMIT {$limit} OFFSET {$offset}");
                $api->send($results);
            }

            $results = $db->fetchAll("SELECT * FROM employees LIMIT {$limit} OFFSET {$offset}");
            $api->send($results);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_GET['employeeid'])) {
                $employeeid = (int) $_GET['employeeid'];
                $data = json_decode(file_get_contents("php://input"), true);
                $master = (int) $data['master'];
                if ($employeeid > 0) {
                    $results = $db->query("DELETE FROM employees_hierarchy WHERE subordinate_id = {$employeeid}");
                    if ($master > 0) $results = $db->query("INSERT INTO employees_hierarchy (master_id, subordinate_id) VALUES ($master, $employeeid)");
                    $api->send(["success" => true]);
                }
            }
        }

        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            if (isset($_GET['employeeid'])) {
                $employeeid = (int) $_GET['employeeid'];
                $data = json_decode(file_get_contents("php://input"), true);

                if (!$data['first_name']) { // eg checking fields
                    $api->setCode(500);
                    $api->send(["error" => "Empty first_name field"]);
                }

                foreach ($data as $param) {
                    $param = $db->escapeString($param);
                }
                if ($employeeid === 0) {
                    $stmt = $db->prepare("INSERT INTO employees (first_name, last_name, position, email, home_phone, notes) VALUES (?, ?, ?, ?, ?, ?)");
                } else {
                    $stmt = $db->prepare("UPDATE employees SET first_name = ?, last_name = ?, position = ?, email = ?, home_phone = ?, notes = ? WHERE id = {$employeeid}");
                }
                $stmt->bind_param("ssssss", $data['first_name'], $data['last_name'], $data['position'], $data['email'], $data['home_phone'], $data['notes']);
                $stmt->execute();
                $api->send(["success" => true, "id" => $db->getLastId()]);
            }
        }

        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            if (isset($_GET['employeeid'])) {
                $employeeid = (int) $_GET['employeeid'];
                $db->query("DELETE FROM employees_hierarchy WHERE master_id = {$employeeid} OR subordinate_id = {$employeeid}"); // 
                $db->query("DELETE FROM employees WHERE id = {$employeeid}");
                $api->send(["success" => $results]);
            }
        }
    } catch (Exception $e) {
        $api->setCode(500);
        $api->send(["error" => "Error while execution: " . $e]);
    }