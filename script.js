let students = [];

fetch('students.json')
    .then(response => response.json())
    .then(data => {
        students = data;
        displayStudents();
    })
    .catch(err => console.error('Помилка завантаження даних:', err));

document.getElementById('addStudentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const student = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        age: document.getElementById('age').value,
        course: document.getElementById('course').value,
        faculty: document.getElementById('faculty').value,
        subjects: document.getElementById('subjects').value.split(',').map(item => item.trim())
    };

    students.push(student);

    displayStudents();

    saveToFile();
});

function displayStudents() {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>${student.faculty}</td>
            <td>${student.subjects.join(', ')}</td>
            <td>
                <button onclick="editStudent(${index})">Редагувати</button>
                <button onclick="deleteStudent(${index})">Видалити</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteStudent(index) {
    students.splice(index, 1);
    displayStudents();
    saveToFile();
}

function editStudent(index) {
    const student = students[index];

    document.getElementById('firstName').value = student.firstName;
    document.getElementById('lastName').value = student.lastName;
    document.getElementById('age').value = student.age;
    document.getElementById('course').value = student.course;
    document.getElementById('faculty').value = student.faculty;
    document.getElementById('subjects').value = student.subjects.join(', ');

    document.getElementById('addStudentForm').onsubmit = function (event) {
        event.preventDefault();
        student.firstName = document.getElementById('firstName').value;
        student.lastName = document.getElementById('lastName').value;
        student.age = document.getElementById('age').value;
        student.course = document.getElementById('course').value;
        student.faculty = document.getElementById('faculty').value;
        student.subjects = document.getElementById('subjects').value.split(',').map(item => item.trim());

        displayStudents();
        saveToFile();

        document.getElementById('addStudentForm').onsubmit = addStudent;
    };
}

function saveToFile() {
    const json = JSON.stringify(students, null, 2);

    fetch('save.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    }).catch(err => console.error('Помилка збереження:', err));
}

document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.lastName.toLowerCase().includes(searchTerm) || 
        student.course.toString().includes(searchTerm)
    );
    displayStudents(filteredStudents);
});