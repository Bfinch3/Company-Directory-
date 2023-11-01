//getting the answers
const inquirer = require('inquirer');
const Server = require('./server')
// Create an array of questions for user input
function initialiaze() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'start',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
            },
        ])//initialiazes function based on choice
        .then((answers) => {
            switch (answers.start) {
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'View All Employees':
                    Server.getAllEmployees(initialiaze)
                    break;
                case 'Update Employee Role':
                    updateEmployee();
                    break;
                case 'View All Roles':
                    Server.getAllRoles(initialiaze)
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    Server.getAllDepartments(initialiaze)
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    Server.dbEnd()
                    process.exit(0);
                    break;
            }
        });
}
function addEmployee() { 
    //Handles server errors
    Server.getArrEmployees((errEmployee, employees) => {
        if (errEmployee) {
            console.error(errEmployee);
            return; 
        }
        Server.getArrRoles((errRoles, roles) => {
            if (errRoles) {
                console.error(errRoles);
                return; 
            }
            Server.getArrDepartments((errDepartment, departments) => {
                if (errDepartment) {
                    console.error(errDepartment);
                    return; 
                }
//Add employee inquirer 
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'newEmployeeFirstName',
                        message: 'What is the employees first name?',
                    },
                    {
                        type: 'input',
                        name: 'newEmployeeLastName',
                        message: 'What is the employees last name?',
                    },
                    {
                        type: 'list',
                        name: 'employeesRole',
                        message: 'What is the employees role?',
                        choices: roles,
                    },
                    {
                        type: 'list',
                        name: 'employeesManager',
                        message: 'Who is the employees manager?',
                        choices: Server.getArrManagers(),
                    }
                ]).then((answers) => {
                    console.log("Added new employee:");
                    console.log("First Name: ", answers.newEmployeeFirstName);
                    console.log("Last Name: ", answers.newEmployeeLastName);
                    console.log("Role: ", answers.employeesRole);
                    console.log("Manager: ", answers.employeesManager);
                    Server.addEmployee(answers.newEmployeeFirstName, answers.newEmployeeLastName, answers.employeesRole, answers.employeesManager, initialiaze);
                });
            });
        });
    });
}//Updates employee role and prompts inquier
function updateEmployee() {
    Server.getArrEmployees((errEmployee, employees) => {
        if (errEmployee) {
            console.error(errEmployee);
            return;
        }

        Server.getArrRoles((errRoles, roles) => {
            if (errRoles) {
                console.error(errRoles);
                return;
            }
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'updateEmployeeRole',
                    message: 'Which employees role do you want to update?',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'chooseRole',
                    message: 'Which role do you want to assign to the employee?',
                    choices: roles
                },
            ]).then((answers) => {
                console.log('Employee selected:', answers.updateEmployeeRole);
                console.log('Employees new role:', answers.chooseRole);
                Server.updateEmployee(answers.updateEmployeeRole, answers.chooseRole, initialiaze);
            }).catch(error => console.error('An error occurred:', error));
        });
    });
}
//adds role and prompts inquier
function addRole() {
    Server.getArrDepartments((err, departments) => {
        if (err) {
            console.error(err);
            return;
        }
        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: value => !isNaN(value) || 'Please enter a number',
            },
            {
                type: 'list',
                name: 'departmentRoleBelongs',
                message: 'Which department does the role belong to?',
                choices: departments
            },
        ]).then((answers) => {
            console.log('New role name:', answers.role);
            console.log('Salary for role:', answers.salary);
            console.log('Roles department:', answers.departmentRoleBelongs);
            Server.addRole(answers.role, answers.salary, answers.departmentRoleBelongs, initialiaze);
        }).catch(error => console.error('An error occurred:', error));
    });
}//add department function  and prompts inquier
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
        }
    ]).then((answers) => {
        console.log('New department added:', answers.department);
        Server.addDepartment(answers.department, initialiaze);
    }).catch(error => console.error('An error occurred:', error));
}
initialiaze()