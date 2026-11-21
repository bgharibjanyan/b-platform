import { fieldRecords } from "../../field-values";
import type { Issue } from "../../types";
import { listField, selectField, textField, textareaField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const hoursDefinition = {
  type: "hours" as const,
  name: "Opening hours",
  plan: "4",
  description: "Weekly hours with dated exceptions.",
  fields: [
    textField("heading", "Heading"),
    listField("days", "Weekly days", "Day", [
      selectField("day", "Day", [
        ["1", "Monday"],
        ["2", "Tuesday"],
        ["3", "Wednesday"],
        ["4", "Thursday"],
        ["5", "Friday"],
        ["6", "Saturday"],
        ["0", "Sunday"],
      ]),
      toggleField("closed", "Closed"),
      listField("windows", "Time windows", "Window", [
        { key: "open", label: "Opens", type: "time", required: true },
        { key: "close", label: "Closes", type: "time", required: true },
      ]),
    ], { titleKey: "day", max: 7 }),
    listField("exceptions", "Dated exceptions", "Exception", [
      { key: "date", label: "Date", type: "date", required: true },
      toggleField("closed", "Closed"),
      { key: "open", label: "Opens", type: "time" },
      { key: "close", label: "Closes", type: "time" },
      textField("label", "Label"),
    ], { titleKey: "date" }),
    textareaField("note", "Note"),
  ],
  options: [
    selectField("timezone", "Timezone", [
      ["Asia/Yerevan", "Asia/Yerevan"],
      ["Europe/Moscow", "Europe/Moscow"],
      ["Europe/London", "Europe/London"],
      ["America/New_York", "America/New_York"],
    ]),
    selectField("clock", "Time format", [["24", "24-hour"], ["12", "12-hour"]]),
    toggleField("showClosed", "Show closed days"),
  ],
  defaults: () => ({
    content: {
      heading: "Opening hours",
      days: ["1", "2", "3", "4", "5"].map((day) => ({ day, closed: false, windows: [{ open: "09:00", close: "18:00" }] })),
      exceptions: [],
      note: "",
    },
    options: { timezone: "Asia/Yerevan", clock: "24", showClosed: true },
  }),
  rules: [
    (c) => {
      const out: Issue[] = [];
      fieldRecords(c.days).forEach((d, i: number) => fieldRecords(d.windows).forEach((w, j: number) => {
        if (typeof w.open === "string" && typeof w.close === "string" && w.open && w.close && w.open >= w.close)
          out.push({
            path: `content.days.${i}.windows.${j}.close`,
            message: "Closing time must be after opening time.",
          });
      }));
      fieldRecords(c.exceptions).forEach((e, i: number) => {
        if (!e.closed && (!e.open || !e.close))
          out.push({ path: `content.exceptions.${i}.open`, message: "Set times or mark the date as closed." });
      });
      return out;
    },
  ],
} satisfies BlockDefinition;
