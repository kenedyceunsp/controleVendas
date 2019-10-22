<?php

class MySQL{
    private static $dsn = 'mysql:dbname=controlevendas; host=localhost';
    private static $user = 'endkey';
    private static $pass = 'osenhordassenhas';
    private static $link;
    private static $query;
    private static $result = [];

    public function __construct(){
        
    }

    public static function connect(){
       if(!isset(self::$link)){
        try {
            self::$link = new PDO(self::$dsn, self::$user, self::$pass);
           } catch (PDOException $e) {
                print $e->getMessage();
           }
       }
    }

    public function execQuery($query){
        $countRow = 0;
        self::connect();
        self::$query = $query;
        try {
         foreach (self::$link->query(self::$query) as $row) {
             self::$result[$countRow] = $row;
             $countRow++;
         }
         
        return self::$result;
        } catch (PDOException $e) {
            return $e->getMessage();
        }

    }
}