const inquirer = require("inquirer");
const queries = require("./queries");

const startApp = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add a Department",
                    "Add a Role",
                    "Add an Employee",
                    "Update an Employee Role",
                    "Add Sales Lead Role",
                    "Exit",
                ],
            },
        ])
        .then(({ action }) => {
            switch (action) {
                case "View All Departments":
                    queries.viewAllDepartments().then(startApp);
                    break;
                case "View All Roles":
                    queries.viewAllRoles().then(startApp);
                    break;
                case "View All Employees":
                    queries.viewAllEmployees().then(startApp);
                    break;
                case "Add a Department":
                    inquirer
                        .prompt({
                            name: "name",
                            message: "What is the name of the department?:",
                        })
                        .then(({ name }) => {
                            queries.addDepartment(name).then(startApp);
                        });
                    break;
                case "Add a Role":
                    queries.getDepartments().then((departments) => {
                        inquirer
                            .prompt([
                                {
                                    name: "title",
                                    message: "What is the name of the role?:",
                                },
                                {
                                    name: "salary",
                                    message: "What is the salary of the role?:",
                                },
                                {
                                    type: "list",
                                    name: "department_id",
                                    message: "Which department does the role belong to?:",
                                    choices: departments.map((department) => ({
                                        name: department.name,
                                        value: department.id,
                                    })),
                                },
                            ])
                            .then(({ title, salary, department_id }) => {
                                queries.addRole(title, salary, department_id).then(startApp);
                            });
                    });
                    break;
                case "Add an Employee":
                    Promise.all([queries.getRoles(), queries.getEmployees()]).then(
                        ([roles, employees]) => {
                            inquirer
                                .prompt([
                                    {
                                        name: "first_name",
                                        message: "What is the employee's first name?:",
                                    },
                                    {
                                        name: "last_name",
                                        message: "What is the employee's last name?:",
                                    },
                                    {
                                        type: "list",
                                        name: "role_id",
                                        message: "What is the employee's role?:",
                                        choices: roles.map((role) => ({
                                            name: role.title,
                                            value: role.id,
                                        })),
                                    },
                                    {
                                        type: "list",
                                        name: "manager_id",
                                        message: "Who is the employee's manager?:",
                                        choices: [
                                            { name: "None", value: null },
                                            ...employees.map((employee) => ({
                                                name: `${employee.first_name} ${employee.last_name}`,
                                                value: employee.id,
                                            })),
                                        ],
                                    },
                                ])
                                .then(({ first_name, last_name, role_id, manager_id }) => {
                                    queries
                                        .addEmployee(first_name, last_name, role_id, manager_id)
                                        .then(startApp);
                                });
                        }
                    );
                    break;
                case "Update an Employee Role":
                    Promise.all([queries.getEmployees(), queries.getRoles()]).then(
                        ([employees, roles]) => {
                            inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        name: "employee_id",
                                        message: "Which employee's role do you want to update?:",
                                        choices: employees.map((employee) => ({
                                            name: `${employee.first_name} ${employee.last_name}`,
                                            value: employee.id,
                                        })),
                                    },
                                    {
                                        type: "list",
                                        name: "role_id",
                                        message:
                                            "Which role do you want to assign the selected employee?:",
                                        choices: roles.map((role) => ({
                                            name: role.title,
                                            value: role.id,
                                        })),
                                    },
                                ])
                                .then(({ employee_id, role_id }) => {
                                    queries
                                        .updateEmployeeRole(employee_id, role_id)
                                        .then(startApp);
                                });
                        }
                    );
                    break;
                case "Add Sales Lead Role":
                    queries.getDepartments().then((departments) => {
                        const salesDepartment = departments.find(
                            (dept) => dept.name === "Sales"
                        );
                        if (salesDepartment) {
                            queries
                                .addRole("Sales Lead", 75000, salesDepartment.id)
                                .then(() => {
                                    console.log("Sales Lead role added.");
                                    startApp();
                                });
                        } else {
                            console.log("Sales department not found.");
                            startApp();
                        }
                    });
                    break;
                case "Exit":
                    process.exit();
            }
        });
};

startApp();
