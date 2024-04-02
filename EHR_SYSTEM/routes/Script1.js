// Get today's date
var today = new Date();

// Get current month and year
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();

// Display calendar
displayCalendar(currentMonth, currentYear);

// Function to display the calendar for a given month and year
function displayCalendar(month, year) {
    var calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // Clear previous calendar

    // Array of month names
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Display month and year
    var header = document.createElement("h2");
    header.textContent = monthNames[month] + " " + year;
    calendar.appendChild(header);

    // Create table for calendar
    var table = document.createElement("table");

    // Create table header with day names
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach(function (day) {
        var th = document.createElement("th");
        th.textContent = day;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
// Get first day of the month
    var firstDay = new Date(year, month, 1);
    // Get the index of the first day of the month (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
    var startingDay = firstDay.getDay();

    // Get number of days in the month
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create table body and rows for calendar
    var tbody = document.createElement("tbody");
    var date = 1;
    for (var i = 0; i < 6; i++) { // Maximum 6 rows
        var tr = document.createElement("tr");
        // Create cells for each day of the week
        for (var j = 0; j < 7; j++) {
            var td = document.createElement("td");
            if (i === 0 && j < startingDay) {
                // Empty cells before the first day of the month
                td.textContent = "";
            } else if (date > daysInMonth) {
                // Empty cells after the last day of the month
                break;
            } else {
                // Fill cells with dates
                td.textContent = date;
                // Add click event listener to each date cell
                td.addEventListener("click", function () {
                    showAppointments(month, year, parseInt(this.textContent));
                });
                date++;
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        if (date > daysInMonth) {
            // Break if all days are filled
            break;
        }
    }
    table.appendChild(tbody);
    calendar.appendChild(table);
}
// Function to show appointments for a specific date
function showAppointments(month, year, day) {
    var appointmentsDiv = document.getElementById("appointments");
    appointmentsDiv.innerHTML = ""; // Clear previous appointments

    // Get appointments for the selected date
    var appointments = [
        { patient: "John Doe", time: "10:00 AM" },
        { patient: "Jane Smith", time: "11:30 AM" },
        { patient: "Alice Johnson", time: "02:00 PM" }
    ];

    // Display appointments
    if (appointments.length > 0) {
        var header = document.createElement("h3");
        header.textContent = "Appointments for " + month + "/" + day + "/" + year;
        appointmentsDiv.appendChild(header);

        var ul = document.createElement("ul");
        appointments.forEach(function (appointment) {
            var li = document.createElement("li");
            li.textContent = appointment.time + " - " + appointment.patient;
            ul.appendChild(li);
        });
        appointmentsDiv.appendChild(ul);
    } else {
        var message = document.createElement("p");
        message.textContent = "No appointments for " + month + "/" + day + "/" + year;
        appointmentsDiv.appendChild(message);
    }
    function redirectToHomePage() {
        window.location.href = "login.html"; // Replace "login.html" with the URL of our home page
    }
}