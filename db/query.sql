-- View all departments
SELECT
    *
FROM
    departments;

-- View all roles
SELECT
    roles.id,
    roles.title,
    departments.name AS department,
    roles.salary
FROM
    roles
    JOIN departments ON roles.department_id = departments.id;

-- View all employees
SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.title,
    departments.name AS department,
    roles.salary,
    CONCAT (manager.first_name, ' ', manager.last_name) AS manager
FROM
    employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS manager ON employees.manager_id = manager.id;

-- Add a department
INSERT INTO
    departments (name)
VALUES
    ('New Department');

-- Add a role
INSERT INTO
    roles (title, salary, department_id)
VALUES
    ('New Role', 60000.00, 1);

-- Add an employee
INSERT INTO
    employees (first_name, last_name, role_id, manager_id)
VALUES
    ('New', 'Employee', 2, 1);

-- Update an employee role
UPDATE employees
SET
    role_id = 3
WHERE
    id = 1;
