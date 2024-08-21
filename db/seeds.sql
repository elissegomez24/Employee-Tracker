-- Add departments
INSERT INTO
    departments (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance');

-- Add roles
INSERT INTO
    roles (title, salary, department_id)
VALUES
    ('Sales Manager', 60000, 1),
    ('Sales Associate', 40000, 1),
    ('Software Engineer', 80000, 2),
    ('Finance Specialist', 50000, 3);

-- Add employees
INSERT INTO
    employees (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Emily', 'Johnson', 3, NULL),
    ('Michael', 'Williams', 4, NULL);