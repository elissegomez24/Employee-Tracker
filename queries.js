const db = require("./db/connection");

module.exports = {
    async viewAllDepartments() {
        try {
            const res = await db.query("SELECT id, name FROM departments");
            console.table(res.rows);
        } catch (err) {
            console.error(err.message);
        }
    },

    async viewAllRoles() {
        try {
            const res = await db.query(`
                SELECT roles.id, roles.title, departments.name AS department, roles.salary 
                FROM roles 
                INNER JOIN departments ON roles.department_id = departments.id`);
            console.table(res.rows);
        } catch (err) {
            console.error(err.message);
        }
    },

    async viewAllEmployees() {
        try {
            const res = await db.query(`
                SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employees 
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees manager ON manager.id = employees.manager_id
                ORDER BY employees.id`);
            console.table(res.rows);
        } catch (err) {
            console.error(err.message);
        }
    },

    async addDepartment(name) {
        try {
            const normalizedDepartmentName = name.toLowerCase();

            const existingDepartment = await db.query(
                "SELECT id FROM departments WHERE LOWER(name) = $1",
                [normalizedDepartmentName]
            );

            if (existingDepartment.rows.length > 0) {
                console.log(
                    `Department "${name}" already exists with ID: ${existingDepartment.rows[0].id}.`
                );
            } else {
                const result = await db.query(
                    "INSERT INTO departments (name) VALUES ($1) RETURNING id, name",
                    [name]
                );
                console.log(
                    `Added ${result.rows[0].name} (ID: ${result.rows[0].id}) to the database.`
                );
            }
        } catch (err) {
            console.error(err.message);
        }
    },

    async addRole(title, salary, department_id) {
        try {
            const result = await db.query(
                "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING id, title",
                [title, salary, department_id]
            );
            console.log(
                `Added ${result.rows[0].title} (ID: ${result.rows[0].id}) to the database.`
            );
        } catch (err) {
            console.error(err.message);
        }
    },

    async addEmployee(first_name, last_name, role_id, manager_id) {
        try {
            const result = await db.query(
                "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name",
                [first_name, last_name, role_id, manager_id]
            );
            console.log(
                `Added ${result.rows[0].first_name} ${result.rows[0].last_name} (ID: ${result.rows[0].id}) to the database.`
            );
        } catch (err) {
            console.error(err.message);
        }
    },

    async updateEmployeeRole(employeeId, roleId) {
        try {
            await db.query("UPDATE employees SET role_id = $1 WHERE id = $2", [
                roleId,
                employeeId,
            ]);
            console.log(`Updated employee's role.`);
        } catch (err) {
            console.error(err.message);
        }
    },

    async getDepartments() {
        try {
            const res = await db.query(
                "SELECT id, name FROM departments ORDER BY name"
            );
            return res.rows;
        } catch (err) {
            console.error(err.message);
            return [];
        }
    },

    async getRoles() {
        try {
            const res = await db.query("SELECT id, title FROM roles");
            return res.rows;
        } catch (err) {
            console.error(err.message);
        }
    },

    async getEmployees() {
        try {
            const res = await db.query(
                "SELECT id, first_name, last_name FROM employees"
            );
            return res.rows;
        } catch (err) {
            console.error(err.message);
        }
    },
};
