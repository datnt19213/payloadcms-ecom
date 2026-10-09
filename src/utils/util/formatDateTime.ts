// export const formatDateTime = (timestamp: string): string => {
//   const now = new Date()
//   let date = now
//   if (timestamp) date = new Date(timestamp)
//   const months = date.getMonth()
//   const days = date.getDate()
//   // const hours = date.getHours();
//   // const minutes = date.getMinutes();
//   // const seconds = date.getSeconds();

//   const MM = months + 1 < 10 ? `0${months + 1}` : months + 1
//   const DD = days < 10 ? `0${days}` : days
//   const YYYY = date.getFullYear()
//   // const AMPM = hours < 12 ? 'AM' : 'PM';
//   // const HH = hours > 12 ? hours - 12 : hours;
//   // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
//   // const SS = (seconds < 10) ? `0${seconds}` : seconds;

//   return `${MM}/${DD}/${YYYY}`
// }

// export const formatDateTimeWithAmPm = (dateString: string): string => {
//   // Parse the date string to a Date object
//   const date = new Date(dateString)

//   // Extract the components
//   const year = date.getUTCFullYear()
//   const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are 0-indexed
//   const day = String(date.getUTCDate()).padStart(2, '0')
//   let hours = date.getUTCHours()
//   const minutes = String(date.getUTCMinutes()).padStart(2, '0')
//   const seconds = String(date.getUTCSeconds()).padStart(2, '0')

//   // Determine AM or PM
//   const period = hours >= 12 ? 'PM' : 'AM'

//   // Convert hours from 24-hour time to 12-hour time
//   hours = hours % 12
//   hours = hours ? hours : 12 // The hour '0' should be '12'

//   // Ensure hours are two digits
//   const formattedHours = String(hours).padStart(2, '0')

//   // Format the date and time components into the desired output string
//   const formattedDate = `${month}-${day}-${year} ${formattedHours}:${minutes}:${seconds} ${period}`

//   return formattedDate
// }

export function formatDate2(isoString: string): string {
  const date = new Date(isoString);

  // Get individual date components
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  // Get individual time components
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = hours.toString().padStart(2, "0");

  // Format the date and time
  return `${month}/${day}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

// export const checkTimeDifference = (dateString: string): void => {
//   // Parse the given date string to a Date object
//   const givenDate = new Date(dateString)

//   // Ensure the date is valid
//   if (isNaN(givenDate.getTime())) {
//     throw new Error('Invalid date')
//   }

//   // Get the current time
//   const currentDate = new Date()

//   // Calculate the difference in milliseconds
//   const differenceInMilliseconds = Math.abs(currentDate.getTime() - givenDate.getTime())

//   // Convert the difference to minutes
//   const differenceInMinutes = differenceInMilliseconds / (1000 * 60)

//   // Check if the difference is more than 5 minutes
//   if (differenceInMinutes > 3) {
//     // window.location.href = '/'
//   }
// }
