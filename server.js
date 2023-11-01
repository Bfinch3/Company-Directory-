const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a connection to the database
const db = mysql.createConnection({
  host: 'ckshdphy86qnz0bj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'ygij8bvp6pa3mw7n',
  password: 'nl7irh4zqm71h7mt',
  database: 'b0kr8yh5bg8s7q3e'
});
// Connect to MySQL
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connected to the company_db database.');
});
const dbEnd = () => {
  db.end((err) => {
    if (err) {
      console.error('Error ending the connection: ', err);
    } else {
      console.log('Connection successfully closed.');
    }
  });
}//Gets all employees 
const getAllEmployees = (callback) => {
  db.query(`SELECT 
e.id, 
e.first_name, 
e.last_name, 
r.title, 
d.name AS department,
CONCAT(m.first_name, ' ', m.last_name) AS manager_name
FROM 
b0kr8yh5bg8s7q3e.employee e
JOIN 
b0kr8yh5bg8s7q3e.role r ON e.role_id = r.id
JOIN 
b0kr8yh5bg8s7q3e.department d ON r.department_id = d.id
LEFT JOIN 
b0kr8yh5bg8s7q3e.employee m ON e.manager_id = m.id;`, function (err, results) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    console.table(results);
    return callback(null);
  });
}
//Gets array of employees
const getArrEmployees = (callback) => {
  db.query(`SELECT concat(first_name,' ', last_name) FROM employee`, (err, results) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      const stringArray = results.map(row => Object.values(row).join(", "));
      callback(null, stringArray);
    }
  });
}
//Gets all departments
const getAllDepartments = (callback) => {
  db.query(`SELECT * FROM department;`, function (err, results) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    console.table(results);
    return callback(null);
  });
}
//Gets array of departments
const getArrDepartments = (callback) => {
  db.query(`SELECT name FROM department`, (err, results) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      const stringArray = results.map(row => Object.values(row).join(", "));
      callback(null, stringArray);
    }
  });
}//gets all roles
const getAllRoles = (callback) => {
  db.query(`SELECT * FROM role;`, function (err, results) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    console.table(results);
    return callback(null);
  });
}//Gets array of roles
const getArrRoles = (callback) => {
  db.query(`SELECT title FROM role`, (err, results) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      const stringArray = results.map(row => Object.values(row).join(", "));
      callback(null, stringArray);
    }
  });
}
//Middleware handeling 404 response and starts the server
app.use((req, res) => {
  res.status(404).end();
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//Updates employee and returns input and adds it to the table
const updateEmployee = (employeeName, newRoleName, callback) => {
  db.query(`UPDATE employee 
  JOIN (
      SELECT id FROM employee WHERE first_name = ? AND last_name = ?
  ) AS emp ON employee.id = emp.id
  SET employee.role_id = (
      SELECT id FROM role WHERE title = ? LIMIT 1
  )
  WHERE employee.first_name = ? AND employee.last_name = ?;`, [employeeName.split(' ')[0], employeeName.split(' ')[1], newRoleName, employeeName.split(' ')[0], employeeName.split(' ')[1],], function (err, results) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null);
  });
};

const addDepartment = (departmentName, callback) => {
  db.query(`INSERT INTO department (name) VALUES(?)`, [departmentName], function (err, results) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null);
  });
};
//Add Role and returns input and adds it to the table
const addRole = (title, salary, departmentId, callback) => {
  db.query(`Insert INTO role (title,salary,department_id)
  VALUES(?, ?,(select id from department where name=?));`, [title, salary, departmentId], function (err, results) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null);
  });
};

//Adds new employee and thier information and returns input and adds it to the table
const addEmployee = (firstName, lastName, roleId, managerId, callback) => {
  db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?,?,
      (SELECT id FROM role WHERE title = ?),
      (SELECT id FROM (SELECT * FROM employee) AS temp WHERE first_name = ? AND last_name = ?)
  );`,
    [firstName, lastName, roleId, managerId.split(' ')[0], managerId.split(' ')[1]],
    function (err, results) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      return callback(null);
    });
};
//Gets manager array
const getArrManagers = () => ['Cina Mann', 'Cindy Reynolds'];

module.exports = { getAllEmployees, getArrManagers, getArrEmployees, getAllDepartments, getArrDepartments, getAllRoles, getArrRoles, addDepartment, addRole, addEmployee, updateEmployee, dbEnd };






