
/* Date Calculating Functions */
export const getTodayDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var final_date_format = yyyy + '-' + mm + '-' + dd;
  return final_date_format;
}

export const getNumDaysApart = (firstDate, secondDate) => {
  let date1 = new Date(firstDate);
  let date2 = new Date(secondDate);
  var rawTimeDifference = date2.getTime() - date1.getTime();
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  let daysApart = Math.ceil(rawTimeDifference / millisecondsPerDay);
  return daysApart;
}

/* Display Functions */
export const getJobAppDate = (job) => {
  if (!job.dateApplied) {
    return "You haven't applied for this job yet!"
  }
  var year = String(job.dateApplied.substring(0,4));
  var month = String(job.dateApplied.substring(5,7));
  var day = String(job.dateApplied.substring(8,10));
  if (day[0] === "0") {
    day = day.substring(1,2);
  }
  if (month[0] === "0") {
    month = month.substring(1,2);
  }
  month = getMonthFromNum(Number(month));
  return `You applied on ${month} ${day}, ${year}`;
}

export const getJobSaveDate = (job) => {
  if (!job.dateCreated) {
    return "Missing Date Added!";
  }
  var year = String(job.dateCreated.substring(0,4));
  var month = String(job.dateCreated.substring(5,7));
  var day = String(job.dateCreated.substring(8,10));
  if (day[0] === "0") {
    day = day.substring(1,2);
  }
  if (month[0] === "0") {
    month = month.substring(1,2);
  }
  month = getMonthFromNum(Number(month));
  return `Job added on ${month} ${day}, ${year}`;
}

export const getMonthFromNum = (num) => {

  if (typeof num !== "number") {
    throw Error("Input must be number");
  }
  if (num < 1 || num > 12) {
    throw Error("Input must be int between 1 and 12 inclusive")
  }

  if (num === 1) {
    return "Jan";
  } else if (num === 2) {
    return "Feb";
  } else if (num === 3) {
    return "Mar";
  } else if (num === 4) {
    return "Apr";
  } else if (num === 5) {
    return "May";
  } else if (num === 6) {
    return "Jun";
  } else if (num === 7) {
    return "Jul";
  } else if (num === 8) {
    return "Aug";
  } else if (num === 9) {
    return "Sep";
  } else if (num === 10) {
    return "Oct";
  } else if (num === 11) {
    return "Nov";
  } else if (num === 12) {
    return "Dec";
  }
  throw Error("Input must be an integer");
}

export const getJobTitle = (job) => {
  return `${job.name} at ${job.company}`;
}

/*
Form Testing Functions
*/
export const checkString = (string) => {
  return typeof(string) === "string" && string.length > 0;
}

export const checkExists = (searchItem, array) => {
  for (let item in array) {
    if (array[item].name === searchItem) {
      return true;
    }
  }
  return false;
}

export const checkAppDate = (appDate) => {
  if (!appDate) {
    return true;
  }
  var todayDate = getTodayDate();
  var numDaysApart = getNumDaysApart(todayDate, appDate);
  return numDaysApart <= 0;
}

/*
Routing functions
*/
export const routeHome = (route) => {
  route.push('/');
}
export const routeArchive = (route) => {
  route.push('/Archive');
}
export const routeHelp = (route) => {
  route.push('/Help');
}
export const routeJobs = (route) => {
  route.push('/Jobs');
}
export const routeUpdateJob = (route, jobId) => {
  route.push(
    '/Update/Job',
    {id: jobId}
  )
}
