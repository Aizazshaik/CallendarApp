package com.example.callendarapp.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Holiday {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private LocalDate date;

        @Enumerated(EnumType.STRING)
        private HolidayType type; // REGULAR or WORK


        public Holiday(LocalDate of, String s, HolidayType holidayType) {
                this.date = of;
                this.name = s;
                this.type = holidayType;
        }
}