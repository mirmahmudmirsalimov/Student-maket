const TOTAL_MARK = 150;
const PASS_PERCENT = 40;
const TOTAL_MARK_PERCENT = 100;


const addZero = function (number) {
    return number < 10 ? "0" + number : number
}

const showDate = function (dateString) {
    const date = new Date(dateString);

    return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

const studentTemplate = document.querySelector("#student-template");
const renderStudent = (student => {
    const {
        id,
        name: sName,
        lastName,
        mark,
        markedDate
    } = student
    localStorage.setItem("students", JSON.stringify(students))
    const studentRow = studentTemplate.content.cloneNode(true);
    const studentId = studentRow.querySelector(".student-id")
    studentId.textContent = id
    const studentName = studentRow.querySelector(".student-name")
    studentName.textContent = `${sName} ${lastName}`;

    const studentMarketDate = studentRow.querySelector(".student-marked-date")
    studentMarketDate.textContent = showDate(markedDate)

    const marcPercent = Math.round(mark * TOTAL_MARK_PERCENT / TOTAL_MARK)

    const studentMark = studentRow.querySelector(".student-mark")
    studentMark.textContent = marcPercent + '%'

    const studentPass = studentRow.querySelector(".student-pass-status")

    if (marcPercent >= PASS_PERCENT) {
        studentPass.textContent = "Pass"
        studentPass.classList.add("bg-success")
    }
    else {
        studentPass.textContent = "Fail"
        studentPass.classList.add("bg-danger")
    }

    const delBtn = studentRow.querySelector(".student-delete")
    delBtn.setAttribute("data-student", id);

    const studentEditBtn = studentRow.querySelector(".student-edit")
    studentEditBtn.setAttribute("data-student", id);

    return studentRow

})


let showingStudents = students.slice()
const studentsTable = document.querySelector("#students-table");
const studentsTableBody = document.querySelector("#students-table-body");
let elCaunt = document.querySelector(".count")
let textMark = document.querySelector(".text-end")




const renderStudents = () => {
    let sum = 0
    showingStudents.forEach(function (student) {
        sum += student.mark
    })
  console.log(sum);
    textMark.textContent = `Average mark: ${Math.round(sum * 100 / 150 / showingStudents.length)}%`
    studentsTableBody.innerHTML = ""
    elCaunt.textContent = `Caunt: ${showingStudents.length}`

    const studentsFragment = document.createDocumentFragment()
    showingStudents.forEach((student) => {
        const studentRow = renderStudent(student)
        studentsFragment.append(studentRow);
    })
    studentsTableBody.append(studentsFragment)

}

renderStudents();

const addStudentModalEl = document.querySelector("#edit-student-modal");
const addStudentModal = new bootstrap.Modal(addStudentModalEl);

const addForm = document.getElementById("add-form")
const inputName = document.getElementById("name")
const inputlastName = document.getElementById("lastname")
const inputMark = document.getElementById("mark")

addForm.addEventListener("submit", function (e) {
    e.preventDefault()

    let inputNameValue = inputName.value
    let inputlastNameValue = inputlastName.value
    let inputMarkValue = inputMark.value
    if (inputNameValue.trim() && inputlastNameValue.trim() && inputMarkValue.trim()) {
        let obj = {
            id: Math.floor(Math.random() * 300),
            name: inputNameValue,
            lastName: inputlastNameValue,
            mark: inputMarkValue,
            markedDate: new Date().toISOString()
        }

        students.push(obj)
        showingStudents.push(obj)
    }
    renderStudents()
    addForm.reset()
    addStudentModal.hide()
})

function getLocalStorage() {
    return localStorage.getItem("students") ? JSON.parse(localStorage.getItem("students")) : [];
}

const nameId = document.querySelector("#edit-name")
const lastnameId = document.querySelector("#edit-lastname")
const markedId = document.querySelector("#edit-mark")
const editForm = document.querySelector("#edit-form")

studentsTable.addEventListener("click", function (evt) {
    if (evt.target.matches(".btn-outline-danger")) {



        // console.log(getitem);
        const clickBtn = +evt.target.dataset.students
        const clickBtnindex = students.findIndex((student) => {
            return (student.id == clickBtn)
        })

        let items = getLocalStorage();
        items = students.filter(function (item) {
            if (item.id == clickBtn) {
                return item
            }
        })
        localStorage.setItem("students", JSON.stringify(items))

        showingStudents.splice(clickBtnindex, 1)


        renderStudents();

    } else if (evt.target.matches(".btn-outline-secondary")) {
        const clickedId = +evt.target.dataset.student


        let clickedItem = students.find(function (student) {
            return student.id === clickedId
        })
        nameId.value = clickedItem.name
        lastnameId.value = clickedItem.lastName
        markedId.value = clickedItem.mark

        editForm.setAttribute("data-editing-id", clickedItem.id)

    }



})
renderStudents();

editForm.addEventListener("submit", function (evt) {
    evt.preventDefault()
    let editingid = +evt.target.dataset.student;
    const nameValu = nameId.value
    const lastNameValue = lastnameId.value
    const markVale = +markedId.value
    if (nameValu.trim() && lastNameValue.trim() && markVale >= 0 && markVale <= TOTAL_MARK) {
        const student = {
            id: editingid,
            name: nameValu,
            lastName: lastNameValue,
            mark: markVale,
            markedDate: new Date().toISOString(),

        }
        const editingItemIndex = students.findIndex(function (student) {
            return student.id === editingid
        })
        const editingShowItemIndex = showingStudents.findIndex(function (student) {
            return student.id === editingid
        })
        students.splice(editingItemIndex, 1, student)
        showingStudents.splice(editingShowItemIndex, 1, student)
    }
    editForm.reset()
    addStudentModal.hide()
    renderStudents()
})


const filterForm = document.querySelector(".filter")
filterForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    const sortValue = evt.target.elements.sortby.value;
    const searchValue = document.querySelector("#search").value

    const markTo = document.querySelector("#to").value
    const markFrom = document.querySelector("#from").value

    showingStudents = students.sort((a, b) => {
        switch (sortValue) {
            case "1":
                if (a.name > b.name) {
                    return 1
                } else if (b.name > a.name) {
                    return -1
                } else {
                    return 0
                }
            case "2":
                return b.mark - a.mark;
            case "3":
                return a.mark - b.mark;
            case "4":
                return new Date(a.markedDate).getTime() - new Date(b.markedDate).getTime();
            default:
                break;
        }
    }).filter((student) => {

        const PercentStudent = Math.round(student.mark * 100 / 150)

        const sdToandFrom = !markTo ? true : PercentStudent <= markTo

        const regExp = new RegExp(searchValue, 'gi')

        const names = `${student.name} ${student.lastName}`;

        return PercentStudent >= markFrom && sdToandFrom && names.match(regExp)


    })
    renderStudents()
}
)