package com.example.callendarapp.services;


import com.example.callendarapp.Model.Holiday;
import com.example.callendarapp.Model.HolidayType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HolidayService {


    private final List<Holiday> allHolidays = new ArrayList<>();

    public HolidayService() {

        LocalDate today = LocalDate.now();
        int currentYear = today.getYear(); // e.g., 2025
        int nextYear = currentYear + 1;    // e.g., 2026
        int prevYear = currentYear - 1;    // e.g., 2024

        // --- Holidays for Previous Year (2024 if currentYear is 2025) ---
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 1, 1), "New Year's Day", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 1, 26), "Republic Day (India)", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 3, 25), "Holi", HolidayType.REGULAR)); // Example holiday
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 5, 1), "May Day (Work Holiday)", HolidayType.WORK));
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 5, 27), "Team Building Day (Work Holiday)", HolidayType.WORK));
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 8, 15), "Independence Day (India)", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 10, 2), "Gandhi Jayanti (India)", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 11, 1), "Diwali", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 12, 25), "Christmas", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(prevYear, 12, 31), "Year End Review (Work Holiday)", HolidayType.WORK));


        // --- Holidays for Current Year (2025 if currentYear is 2025) ---
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 1, 1), "New Year's Day", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 1, 26), "Republic Day (India)", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 3, 25), "Holi", HolidayType.REGULAR)); // Example holiday
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 5, 1), "May Day (Work Holiday)", HolidayType.WORK));
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 5, 27), "Team Building Day (Work Holiday)", HolidayType.WORK));
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 8, 15), "Independence Day (India)", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 10, 2), "Gandhi Jayanti (India)", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 11, 1), "Diwali", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 12, 25), "Christmas", HolidayType.REGULAR));


        allHolidays.add(new Holiday(LocalDate.of(currentYear, 6, 10), "Company Anniversary (Work Holiday)", HolidayType.WORK));
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 6, 10), "Local Festival", HolidayType.REGULAR));


        allHolidays.add(new Holiday(LocalDate.of(currentYear, 6, 23), "Project Milestone Meeting (Work Holiday)", HolidayType.WORK));
        allHolidays.add(new Holiday(LocalDate.of(currentYear, 6, 25), "Mandatory Training (Work Holiday)", HolidayType.WORK));


        allHolidays.add(new Holiday(LocalDate.of(nextYear, 1, 1), "New Year's Day", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(nextYear, 1, 26), "Republic Day (India)", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(nextYear, 3, 29), "Good Friday", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(nextYear, 5, 1), "May Day (Work Holiday)", HolidayType.WORK));
        allHolidays.add(new Holiday(LocalDate.of(nextYear, 5, 15), "Quarterly Review (Work Holiday)", HolidayType.WORK));
        allHolidays.add(new Holiday(LocalDate.of(nextYear, 8, 15), "Independence Day (India)", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(nextYear, 10, 2), "Gandhi Jayanti (India)", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(nextYear, 11, 10), "Diwali", HolidayType.REGULAR));
        allHolidays.add(new Holiday(LocalDate.of(nextYear, 12, 25), "Christmas", HolidayType.REGULAR));

        System.out.println("HolidayService initialized with in-memory data for demo.");
    }

    public List<Holiday> getHolidaysInRange(LocalDate startDate, LocalDate endDate) {

        return allHolidays.stream()
                .filter(h -> !h.getDate().isBefore(startDate) && !h.getDate().isAfter(endDate))
                .collect(Collectors.toList());
    }
}