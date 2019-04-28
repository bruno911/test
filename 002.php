<?php


/*
 *
 002: Demonstrate using PHP how you would connect to a MySQL or PostgreSQL database and query
for a specific record with the following fields: “id_user”, “name”, “age”, “job_title”, “inserted_on”,
“last_updated”) from a table called 'users', using the ‘id_user’ field. Indicate how you would create the
table taking into consideration that we are going to access to the table data only by ‘id_user’. Provide an
example of how you would write a record in this same table with the user data that comes from a form
send by an HTTP POST request. Don’t need to create the form, but you can create it if it helps you.
Think about what in the database design can be improved, given the current set of data.
*/

class Database {

    /**
     * @var PDO
     */
    protected $connection;

    public function __construct()
    {
        $this->connect();
    }

    protected function connect()
    {
        //This would usually be from a config file/array
        $servername = "localhost";
        $username = "username";
        $password = "password";
        $db = "DB";

        try {
            $this->connection = new PDO("mysql:host={$servername};dbname={$db}", $username, $password);
            // set the PDO error mode to exception
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch(PDOException $e)
        {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    /**
     * @return PDO
     */
    protected function getConnection()
    {
        if($this->connection){
            return $this->connection;
        }

        $this->connect();

        return $this->connection;
    }
}


class UserRepository extends Database {

    public function buildUserTable()
    {
        /**
         * @var $connection PDO
         */
        $connection = $this->getConnection();
        $connection->query("
            CREATE TABLE users (
                id_user int PRIMARY KEY UNIQUE AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                age INT(3) NULL,
                job_title VARCHAR(255) NULL,
                inserted_on DATETIME,
                last_updated DATETIME
            );
        ");

    }

    public function byIdOrFail($userId)
    {
        /**
         * @var $connection PDO
         */
        $connection = $this->getConnection();

        $query = $connection->prepare("
                SELECT
                    id_user,
                    name,
                    age,
                    job_title,
                    inserted_on,
                    last_updated
                FROM
                    users
                WHERE
                    id_user=:id_user
                ;");

        $query->bindParam(':id_user', $userId);
        $query->execute();

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function create($name, $age, $jobTitle)
    {
        /**
         * @var $connection PDO
         */
        $connection = $this->getConnection();

        $query = $connection->prepare("
                INSERT INTO users
                    (
                     name,
                     age,
                     job_title,
                     inserted_on
                    )
                    values
                    (
                     :name,
                     :age,
                     :job_title,
                     now()
                    );
                ;");

        $newUserId = null;

        try {
            $connection->beginTransaction();
            $query->bindParam(':name', $name);
            $query->bindParam(':age', $age);
            $query->bindParam(':job_title', $jobTitle);
            $query->execute();
            $newUserId = $connection->lastInsertId();
            $connection->commit();

        } catch(PDOExecption $e) {
            $connection->rollback();
        }

        return $newUserId;
    }
}