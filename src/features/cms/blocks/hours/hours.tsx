import { useSyncExternalStore } from "react";
import { fieldRecords, fieldText } from "../../field-values";
import { companyLabels } from "../../locale-labels";
import type { FieldValues } from "../../types";
import { BlockHeading } from "../shared/shared";
import type { BlockProps } from "../types";

function subscribeToClock(update: () => void) {
  const timer = window.setInterval(update, 60_000);
  return () => window.clearInterval(timer);
}

function formatTime(value: unknown, clock: unknown) {
  const time = fieldText(value) ?? "";
  if (!time || clock !== "12") return time;

  const [hour, minute] = time.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

export function HoursBlock({ content, options, locale }: BlockProps) {
  const labels = companyLabels[locale];
  const timezone = fieldText(options.timezone) || "Asia/Yerevan";
  const today = useSyncExternalStore(
    subscribeToClock,
    () => new Date().toLocaleDateString("sv-SE", { timeZone: timezone }),
    () => "",
  );
  const days = fieldRecords(content.days).filter(day => options.showClosed || !day.closed);
  const exceptions = fieldRecords(content.exceptions);
  const todayException = exceptions.find(exception => exception.date === today);
  const note = fieldText(content.note);

  function formatWindow(window: FieldValues) {
    return [formatTime(window.open, options.clock), formatTime(window.close, options.clock)]
      .filter(Boolean)
      .join(" – ");
  }

  function exceptionHours(exception: FieldValues) {
    return exception.closed ? labels.closed : formatWindow(exception);
  }

  return (
    <>
      <BlockHeading value={content.heading} />
      <table className="co-hours">
        <tbody>
          {days.map((day, index) => (
            <tr key={index}>
              <th scope="row">{labels.days[Number(day.day)]}</th>
              <td>{day.closed ? labels.closed : fieldRecords(day.windows).map(formatWindow).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small>{timezone}</small>
      {note && <p>{note}</p>}
      {todayException && (
        <p className="co-hours-exception">
          <strong>{fieldText(todayException.label) || today}</strong>{" · "}{exceptionHours(todayException)}
        </p>
      )}
      {exceptions.length > 0 && (
        <ul>
          {exceptions.map((exception, index) => {
            const date = fieldText(exception.date);
            return (
              <li key={index}>
                <time dateTime={date} aria-current={today === date ? "date" : undefined}>{date}</time>
                {" · "}{fieldText(exception.label)}{" "}{exceptionHours(exception)}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
