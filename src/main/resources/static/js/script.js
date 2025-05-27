document.addEventListener('DOMContentLoaded', () => {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthYearHeader = document.getElementById('current-month-year');

    const prevMonthTitle = document.getElementById('prev-month-title');
    const currentMonthTitle = document.getElementById('current-month-title');
    const nextMonthTitle = document.getElementById('next-month-title');

    const prevMonthGrid = document.getElementById('prev-month-grid');
    const currentMonthGrid = document.getElementById('current-month-grid');
    const nextMonthGrid = document.getElementById('next-month-grid');

    let currentDisplayDate = new Date(); // Start with current month

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Function to generate the calendar grid for a given month
    function generateMonthGrid(targetMonthDate, monthGridElement, monthTitleElement) {
        monthGridElement.innerHTML = ''; // Clear previous content
        monthTitleElement.textContent = targetMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const year = targetMonthDate.getFullYear();
        const month = targetMonthDate.getMonth(); // 0-indexed month

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of current month
        const daysInMonth = lastDayOfMonth.getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

        // Add day names row
        dayNames.forEach(dayName => {
            const dayNameDiv = document.createElement('div');
            dayNameDiv.classList.add('day-name');
            dayNameDiv.textContent = dayName;
            monthGridElement.appendChild(dayNameDiv);
        });

        // Add empty cells for days before the 1st
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty');
            monthGridElement.appendChild(emptyDay);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = i;
            const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            dayDiv.dataset.date = fullDate; // YYYY-MM-DD
            monthGridElement.appendChild(dayDiv);
        }
    }

    // Function to fetch holidays from the backend
    async function fetchHolidays(startDate, endDate) {
        try {
            const startParam = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
            const endParam = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

            console.log(`Workspaceing holidays from ${startParam} to ${endParam}`);
            const response = await fetch(`/api/holidays?startDate=${startParam}&endDate=${endParam}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const holidays = await response.json();
            console.log("Fetched holidays:", holidays);
            return holidays;
        } catch (error) {
            console.error('Error fetching holidays:', error);
            return []; // Return empty array on error
        }
    }

    // Function to render the entire calendar (3 months)
    async function renderCalendar() {
        const currentMonth = currentDisplayDate.getMonth();
        const currentYear = currentDisplayDate.getFullYear();

        // Update main header
        currentMonthYearHeader.textContent = `${currentDisplayDate.toLocaleString('default', { month: 'long' })} ${currentYear}`;

        // Previous month
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        generateMonthGrid(prevMonthDate, prevMonthGrid, prevMonthTitle);

        // Current month
        generateMonthGrid(currentDisplayDate, currentMonthGrid, currentMonthTitle);

        // Next month
        const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
        generateMonthGrid(nextMonthDate, nextMonthGrid, nextMonthTitle);

        // Highlight current day in the current month grid
        const today = new Date();
        const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const currentMonthTodayElement = currentMonthGrid.querySelector(`.day[data-date="${todayFormatted}"]`);
        if (currentMonthTodayElement) {
            currentMonthTodayElement.classList.add('current-day');
        }

        // Fetch and apply holidays
        // Fetch 12 months before the previous month to 12 months after the next month
        const holidaysStartDate = new Date(currentYear, currentMonth - 1 - 12, 1);
        const holidaysEndDate = new Date(currentYear, currentMonth + 1 + 12 + 1, 0); // +1 to month for next month, +12 for range, +1 for end of month
        const allHolidays = await fetchHolidays(holidaysStartDate, holidaysEndDate);

        // Collect all day elements from all three grids
        const allDayElements = document.querySelectorAll('.calendar-grid .day:not(.empty)');

        // Clear any previous holiday/week classes from all days
        allDayElements.forEach(dayEl => {
            dayEl.classList.remove('is-holiday', 'is-work-holiday', 'has-single-work-holiday', 'has-multiple-work-holidays');
            dayEl.removeAttribute('data-holidays'); // Clear tooltip data
        });

        // Map to store holidays for each date for easier processing
        const holidaysByDate = new Map();
        allHolidays.forEach(holiday => {
            if (!holidaysByDate.has(holiday.date)) {
                holidaysByDate.set(holiday.date, []);
            }
            holidaysByDate.get(holiday.date).push(holiday);
        });

        // Apply holiday classes and prepare for vacation planning
        allDayElements.forEach(dayElement => {
            const date = dayElement.dataset.date;
            const holidaysOnThisDay = holidaysByDate.get(date);

            if (holidaysOnThisDay && holidaysOnThisDay.length > 0) {
                dayElement.classList.add('is-holiday');
                // Check for work holiday priority
                const hasWorkHoliday = holidaysOnThisDay.some(h => h.type === 'WORK');
                if (hasWorkHoliday) {
                    dayElement.classList.add('is-work-holiday');
                }
                // Store holidays for tooltip, showing work holiday first if present
                let tooltipText = holidaysOnThisDay
                    .sort((a, b) => (b.type === 'WORK' ? 1 : -1) - (a.type === 'WORK' ? 1 : -1)) // Prioritize WORK in tooltip
                    .map(h => h.name)
                    .join(', ');
                dayElement.dataset.holidays = tooltipText;
            }
        });

        // Vacation Planning Aid: Identify weeks with work holidays
        // This is applied after all day-level holiday classes are set
        document.querySelectorAll('.calendar-grid').forEach(grid => {
            const daysInGrid = Array.from(grid.querySelectorAll('.day:not(.empty)'));
            // This loop iterates through the days and groups them into 7-day 'weeks'
            // It assumes the first day of the grid is the start of a logical week.
            // For a perfect week grouping, you might need to adjust the initial empty cells.
            for (let i = 0; i < daysInGrid.length; i += 7) {
                const weekDays = daysInGrid.slice(i, i + 7);
                let workHolidayCount = 0;
                weekDays.forEach(day => {
                    if (day.classList.contains('is-work-holiday')) {
                        workHolidayCount++;
                    }
                });

                if (workHolidayCount > 0) {
                    weekDays.forEach(day => {
                        if (workHolidayCount === 1) {
                            day.classList.add('has-single-work-holiday');
                        } else {
                            day.classList.add('has-multiple-work-holidays');
                        }
                    });
                }
            }
        });
    }

    // Event listeners for navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial render
    renderCalendar();
});