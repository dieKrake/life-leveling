export function formatTodoDate(
  startTimeStr: string,
  endTimeStr: string
): string {
  const startDate = new Date(startTimeStr);
  const endDate = new Date(endTimeStr);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  // Prüfen, ob es sich um ein ganztägiges Event handelt (oft ist Start- und Endzeit identisch und um Mitternacht UTC)
  // Oder wenn das Format nur ein Datum ist (YYYY-MM-DD)
  if (startTimeStr.length <= 10) {
    const dateOnlyOptions: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return `${startDate.toLocaleDateString(
      "de-DE",
      dateOnlyOptions
    )} (Ganztägig)`;
  }

  const formattedStartDate = startDate.toLocaleString("de-DE", options);

  // Wenn Start- und End-Tag identisch sind, nur die Uhrzeit anzeigen
  if (startDate.toDateString() === endDate.toDateString()) {
    const timeOnlyOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedEndTime = endDate.toLocaleTimeString(
      "de-DE",
      timeOnlyOptions
    );
    return `${formattedStartDate} - ${formattedEndTime} Uhr`;
  }

  // Wenn sich die Tage unterscheiden, das volle Enddatum anzeigen
  const formattedEndDate = endDate.toLocaleString("de-DE", options);
  return `${formattedStartDate} Uhr - ${formattedEndDate} Uhr`;
}
